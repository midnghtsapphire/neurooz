import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rawContent, existingProjects, documentUrls } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing brain dump, content length:", rawContent?.length);
    console.log("Document URLs to process:", documentUrls?.length || 0);

    // Initialize Supabase client to read uploaded files
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Collect content from uploaded documents
    let documentContent = "";
    if (documentUrls && documentUrls.length > 0) {
      console.log("Fetching uploaded documents...");
      
      for (const filePath of documentUrls) {
        try {
          // Download the file
          const { data, error } = await supabase.storage
            .from("user-documents")
            .download(filePath);
          
          if (error) {
            console.error(`Error downloading ${filePath}:`, error);
            continue;
          }

          // Get file extension
          const ext = filePath.split('.').pop()?.toLowerCase();
          
          // For text-based files, read directly
          if (['txt', 'md', 'csv', 'json'].includes(ext || '')) {
            const text = await data.text();
            documentContent += `\n\n--- File: ${filePath.split('/').pop()} ---\n${text}`;
            console.log(`Read text file: ${filePath}`);
          } 
          // For PDFs and other documents, note that they were uploaded
          // (Full parsing would require a PDF library)
          else if (['pdf', 'doc', 'docx'].includes(ext || '')) {
            documentContent += `\n\n--- Document: ${filePath.split('/').pop()} (uploaded, needs manual review) ---`;
            console.log(`Noted document: ${filePath}`);
          }
          // For images, note they were uploaded
          else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) {
            documentContent += `\n\n--- Image: ${filePath.split('/').pop()} (uploaded for reference) ---`;
            console.log(`Noted image: ${filePath}`);
          }
        } catch (fileErr) {
          console.error(`Error processing file ${filePath}:`, fileErr);
        }
      }
    }

    // Combine raw content with document content
    const fullContent = rawContent + documentContent;
    console.log("Full content length:", fullContent.length);

    const systemPrompt = `You are an AI assistant that helps organize chaotic brain dumps into structure WITHOUT deleting or “cleaning up” the user's memory cues.

CRITICAL RULES (ADHD / cognitive-access friendly):
- You MUST preserve the user's intent and *memory anchors* (odd keywords, symbolism words, nicknames, shorthand, messy phrasing).
- Never rewrite the user's unique phrases into generic corporate language.
- Never omit details just because they seem redundant. Redundancy can be a reminder.
- Your output is ADDITIVE: it helps organize, but it must not "strip" anything important.
- If you are unsure where something belongs, put it in inbox_items rather than dropping it.

Given a brain dump (stream of consciousness + any uploaded file text), return JSON in this shape:
{
  "summary": "A short, human-friendly summary that keeps key wording (2-5 sentences)",
  "memory_anchors": ["exact words/phrases to keep", "..."],
  "verbatim_cues": ["short exact quotes/snippets from the dump", "..."],
  "action_items": [
    {"title": "Action item (keep original wording)", "priority": "high|medium|low", "category": "category name", "suggested_project": "project name or null", "source_snippet": "exact snippet that triggered this"}
  ],
  "categories": [
    {"name": "Category", "keywords": ["relevant", "terms"], "suggested_project": "if matches existing project or 'NEW: Project Name'"}
  ],
  "inbox_items": [
    {"content": "Maybe/someday/idea/reference item (keep original wording)", "type": "maybe|someday|idea|reference", "source_snippet": "exact snippet that triggered this"}
  ]
}

Existing projects to match against: ${existingProjects?.join(', ') || 'None'}

IMPORTANT: Extract EVERYTHING from the content. Do not drop or compress symbolic/odd reminder words—include them in memory_anchors/verbatim_cues.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: fullContent }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received");

    // Parse JSON from response
    let parsed;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsed = JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      parsed = {
        summary: "Unable to parse brain dump. Please try again.",
        action_items: [],
        categories: [],
        inbox_items: []
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing brain dump:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

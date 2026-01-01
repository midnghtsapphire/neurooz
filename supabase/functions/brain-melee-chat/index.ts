import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, phase } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (phase === "trust-building") {
      systemPrompt = `You are a warm, empathetic assistant helping someone unload their thoughts during a "Brain Melee" session. Your goal is to build trust and make them feel comfortable sharing.

Guidelines:
- Be genuinely curious and caring
- Ask follow-up questions to understand their situation
- Acknowledge their feelings and validate their experiences
- Keep responses short (1-3 sentences max)
- If they seem stressed, offer reassurance
- Guide them naturally toward sharing what's on their mind

Sample conversation starters you might use:
- "How's your day going so far?"
- "What's been taking up most of your mental energy lately?"
- "Is there something specific weighing on you?"
- "Tell me more about that..."

Remember: You're here to listen, not to fix. Build rapport first.`;
    } else if (phase === "organizing") {
      systemPrompt = `You are an organizing assistant that takes a brain dump and structures it into actionable items.

Given the conversation history, extract:
1. All tasks, to-dos, and action items
2. Projects or larger initiatives
3. Ideas or future possibilities
4. Concerns or blockers
5. Deadlines or time-sensitive items

Format your response as JSON:
{
  "projects": [{"name": "Project Name", "description": "Brief description", "priority": "high|medium|low"}],
  "tasks": [{"title": "Task", "project": "Parent project or null", "priority": "high|medium|low", "due_context": "any deadline mentioned"}],
  "ideas": [{"title": "Idea", "notes": "Details"}],
  "concerns": [{"issue": "Concern", "suggested_action": "What might help"}]
}`;
    } else {
      systemPrompt = `You are a helpful assistant guiding someone through organizing their thoughts. Be warm and supportive.`;
    }

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
          ...messages
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
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ message: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in brain-melee-chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { Project, ActionItem } from "@/hooks/use-projects";
import { ProjectItem } from "@/hooks/use-project-items";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, FileSpreadsheet, FileText } from "lucide-react";
import { format } from "date-fns";

interface ExportData {
  projects: Project[];
  actionItems: ActionItem[];
  projectItems?: ProjectItem[];
}

interface ExportMenuProps {
  data: ExportData;
}

export function ExportMenu({ data }: ExportMenuProps) {
  const generateCSV = () => {
    const rows: string[] = [];
    
    // Header
    rows.push("Type,Name,Description,Status,Assigned To,Priority,Due Date,Created");
    
    // Projects
    data.projects.forEach((p) => {
      rows.push([
        "Project",
        `"${p.name.replace(/"/g, '""')}"`,
        `"${(p.description || "").replace(/"/g, '""')}"`,
        p.is_completed ? "Completed" : "Active",
        `"${p.assigned_to || ""}"`,
        "",
        "",
        format(new Date(p.created_at), "yyyy-MM-dd"),
      ].join(","));
    });
    
    // Action Items
    data.actionItems.forEach((item) => {
      const project = data.projects.find((p) => p.id === item.project_id);
      rows.push([
        "Action Item",
        `"${item.title.replace(/"/g, '""')}"`,
        `"${(item.description || "").replace(/"/g, '""')}"`,
        item.is_completed ? "Completed" : "Active",
        `"${project?.assigned_to || ""}"`,
        item.priority,
        item.due_date || "",
        format(new Date(item.created_at), "yyyy-MM-dd"),
      ].join(","));
    });

    // Project Items
    data.projectItems?.forEach((item) => {
      rows.push([
        item.is_action_item ? "Converted Item" : "Project Item",
        `"${item.title.replace(/"/g, '""')}"`,
        `"${(item.description || "").replace(/"/g, '""')}"`,
        item.is_action_item ? "Converted" : "Pending",
        "",
        "",
        "",
        format(new Date(item.created_at), "yyyy-MM-dd"),
      ].join(","));
    });

    return rows.join("\n");
  };

  const downloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `projects-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generatePrintHTML = () => {
    let html = `
      <html>
        <head>
          <title>Projects Report - ${format(new Date(), "MMM d, yyyy")}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .status-active { color: #059669; }
            .status-completed { color: #6b7280; text-decoration: line-through; }
            .priority-high { color: #dc2626; font-weight: bold; }
            .priority-medium { color: #d97706; }
            .priority-low { color: #6b7280; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
            .badge-project { background: #e0e7ff; color: #3730a3; }
            .badge-action { background: #dcfce7; color: #166534; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>Projects Report</h1>
          <p>Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
    `;

    // Projects Section
    html += `<h2>Projects (${data.projects.length})</h2>`;
    html += `<table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Assigned To</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
    `;
    data.projects.forEach((p) => {
      html += `<tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.description || "-"}</td>
        <td>${p.assigned_to || "-"}</td>
        <td class="${p.is_completed ? "status-completed" : "status-active"}">${p.is_completed ? "Completed" : "Active"}</td>
        <td>${format(new Date(p.created_at), "MMM d, yyyy")}</td>
      </tr>`;
    });
    html += `</tbody></table>`;

    // Action Items Section
    html += `<h2>Action Items (${data.actionItems.length})</h2>`;
    html += `<table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Project</th>
          <th>Priority</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
    `;
    data.actionItems.forEach((item) => {
      const project = data.projects.find((p) => p.id === item.project_id);
      html += `<tr>
        <td>${item.title}</td>
        <td>${project?.name || "-"}</td>
        <td class="priority-${item.priority}">${item.priority}</td>
        <td>${item.due_date ? format(new Date(item.due_date), "MMM d, yyyy") : "-"}</td>
        <td class="${item.is_completed ? "status-completed" : "status-active"}">${item.is_completed ? "Done" : "Pending"}</td>
      </tr>`;
    });
    html += `</tbody></table>`;

    html += `</body></html>`;
    return html;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(generatePrintHTML());
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(generatePrintHTML());
      previewWindow.document.close();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuItem onClick={downloadCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePreview} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Preview Report
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint} className="gap-2 cursor-pointer">
          <Printer className="h-4 w-4" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

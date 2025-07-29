import { toast } from 'sonner';

export interface ExportablePrompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags?: string[];
  category?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  folder_id?: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

// Export prompts to different formats
export const exportPrompts = (prompts: ExportablePrompt[], format: 'json' | 'csv' | 'txt') => {
  try {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(prompts, null, 2);
        filename = `prompts_export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;

      case 'csv':
        const headers = ['Title', 'Content', 'Description', 'Tags', 'Category', 'Author', 'Created At', 'Is Public'];
        const csvRows = [headers.join(',')];
        
        prompts.forEach(prompt => {
          const row = [
            `"${(prompt.title || '').replace(/"/g, '""')}"`,
            `"${(prompt.content || '').replace(/"/g, '""')}"`,
            `"${(prompt.description || '').replace(/"/g, '""')}"`,
            `"${(prompt.tags || []).join('; ')}"`,
            `"${prompt.category || ''}"`,
            `"${prompt.author || ''}"`,
            `"${prompt.created_at || ''}"`,
            `"${prompt.is_public || false}"`
          ];
          csvRows.push(row.join(','));
        });
        
        content = csvRows.join('\n');
        filename = `prompts_export_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
        break;

      case 'txt':
        content = prompts.map(prompt => {
          return `Title: ${prompt.title}\n` +
                 `Content: ${prompt.content}\n` +
                 `Description: ${prompt.description || 'N/A'}\n` +
                 `Tags: ${(prompt.tags || []).join(', ')}\n` +
                 `Category: ${prompt.category || 'N/A'}\n` +
                 `Author: ${prompt.author || 'N/A'}\n` +
                 `Created: ${prompt.created_at || 'N/A'}\n` +
                 `Public: ${prompt.is_public ? 'Yes' : 'No'}\n` +
                 '---\n\n';
        }).join('');
        filename = `prompts_export_${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
        break;

      default:
        throw new Error('Unsupported export format');
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${prompts.length} prompts as ${format.toUpperCase()}`);
    return true;
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export prompts');
    return false;
  }
};

// Import prompts from different formats
export const importPrompts = async (file: File, targetFolderId?: string): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    imported: 0,
    errors: []
  };

  try {
    const fileContent = await readFileContent(file);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    let parsedPrompts: ExportablePrompt[] = [];

    switch (fileExtension) {
      case 'json':
        parsedPrompts = parseJsonImport(fileContent);
        break;
      case 'csv':
        parsedPrompts = parseCsvImport(fileContent);
        break;
      case 'txt':
        parsedPrompts = parseTxtImport(fileContent);
        break;
      default:
        result.errors.push(`Unsupported file format: ${fileExtension}`);
        return result;
    }

    // Validate and format prompts
    const validPrompts: ExportablePrompt[] = [];
    
    parsedPrompts.forEach((prompt, index) => {
      const validationErrors = validatePrompt(prompt, index + 1);
      if (validationErrors.length === 0) {
        // Format prompt for system compatibility
        const formattedPrompt = formatPromptForSystem(prompt, targetFolderId);
        validPrompts.push(formattedPrompt);
      } else {
        result.errors.push(...validationErrors);
      }
    });

    // Save valid prompts (mock implementation)
    if (validPrompts.length > 0) {
      const existingPrompts = JSON.parse(localStorage.getItem('pigeonprompt_prompts') || '[]');
      const updatedPrompts = [...existingPrompts, ...validPrompts];
      localStorage.setItem('pigeonprompt_prompts', JSON.stringify(updatedPrompts));
      
      result.imported = validPrompts.length;
      result.success = true;
    }

    if (result.imported > 0) {
      toast.success(`Successfully imported ${result.imported} prompts`);
    }
    
    if (result.errors.length > 0) {
      toast.warning(`Import completed with ${result.errors.length} errors`);
    }

    return result;
  } catch (error) {
    console.error('Import error:', error);
    result.errors.push(`Failed to import file: ${error}`);
    toast.error('Failed to import prompts');
    return result;
  }
};

// Helper functions
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const parseJsonImport = (content: string): ExportablePrompt[] => {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

const parseCsvImport = (content: string): ExportablePrompt[] => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) throw new Error('CSV file must have headers and at least one data row');
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
  const prompts: ExportablePrompt[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    const prompt: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      switch (header) {
        case 'title':
          prompt.title = value;
          break;
        case 'content':
          prompt.content = value;
          break;
        case 'description':
          prompt.description = value;
          break;
        case 'tags':
          prompt.tags = value ? value.split(';').map(t => t.trim()).filter(t => t) : [];
          break;
        case 'category':
          prompt.category = value;
          break;
        case 'author':
          prompt.author = value;
          break;
        case 'is public':
          prompt.is_public = value.toLowerCase() === 'true';
          break;
      }
    });
    
    prompts.push(prompt);
  }
  
  return prompts;
};

const parseTxtImport = (content: string): ExportablePrompt[] => {
  const sections = content.split('---').filter(section => section.trim());
  const prompts: ExportablePrompt[] = [];
  
  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const prompt: any = {};
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      switch (key.toLowerCase().trim()) {
        case 'title':
          prompt.title = value;
          break;
        case 'content':
          prompt.content = value;
          break;
        case 'description':
          prompt.description = value !== 'N/A' ? value : '';
          break;
        case 'tags':
          prompt.tags = value !== 'N/A' ? value.split(',').map(t => t.trim()).filter(t => t) : [];
          break;
        case 'category':
          prompt.category = value !== 'N/A' ? value : '';
          break;
        case 'author':
          prompt.author = value !== 'N/A' ? value : '';
          break;
        case 'public':
          prompt.is_public = value.toLowerCase() === 'yes';
          break;
      }
    });
    
    if (prompt.title && prompt.content) {
      prompts.push(prompt);
    }
  });
  
  return prompts;
};

const validatePrompt = (prompt: any, index: number): string[] => {
  const errors: string[] = [];
  
  if (!prompt.title || typeof prompt.title !== 'string' || prompt.title.trim().length === 0) {
    errors.push(`Row ${index}: Title is required`);
  }
  
  if (!prompt.content || typeof prompt.content !== 'string' || prompt.content.trim().length === 0) {
    errors.push(`Row ${index}: Content is required`);
  }
  
  if (prompt.title && prompt.title.length > 200) {
    errors.push(`Row ${index}: Title is too long (max 200 characters)`);
  }
  
  return errors;
};

const formatPromptForSystem = (prompt: any, targetFolderId?: string): ExportablePrompt => {
  return {
    id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: prompt.title.trim(),
    content: prompt.content.trim(),
    description: prompt.description?.trim() || '',
    tags: Array.isArray(prompt.tags) ? prompt.tags : [],
    category: prompt.category || 'general',
    author: prompt.author || 'Imported',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_public: Boolean(prompt.is_public),
    folder_id: targetFolderId
  };
};
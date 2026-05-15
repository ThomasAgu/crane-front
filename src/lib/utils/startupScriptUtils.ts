/**
 * Utility functions for handling startup scripts
 */

export type StartupScript = {
  name: string;
  content: string;
  type: string;
};

/**
 * Read a file and return its content as text or base64
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Read a file and return its content as base64
 */
export async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop() || "txt";
}

/**
 * Create FormData with startup scripts for multipart upload
 */
export function createStartupScriptsFormData(scripts: StartupScript[]): FormData {
  const formData = new FormData();
  
  scripts.forEach((script, index) => {
    formData.append(
      `startupScripts[${index}][name]`,
      script.name
    );
    formData.append(
      `startupScripts[${index}][content]`,
      script.content
    );
    formData.append(
      `startupScripts[${index}][type]`,
      script.type
    );
  });

  return formData;
}

/**
 * Convert startup scripts to JSON payload
 */
export function createStartupScriptsPayload(scripts: StartupScript[]): Record<string, any> {
  return {
    startupScripts: scripts.map((script) => ({
      name: script.name,
      content: script.content,
      type: script.type,
    })),
  };
}

/**
 * Validate startup script file
 */
export function validateStartupScriptFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const validExtensions = [
    "sql",
    "sh",
    "bash",
    "js",
    "py",
    "dockerfile",
    "txt",
    "gz",
    "tar",
  ];

  const fileExtension = getFileExtension(file.name).toLowerCase();

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo "${file.name}" es demasiado grande (máximo 10MB)`,
    };
  }

  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `El tipo de archivo "${fileExtension}" no está permitido`,
    };
  }

  return { valid: true };
}

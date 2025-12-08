// Single Responsibility Principle: Handles only preview URL generation

export interface PreviewGenerator {
  generate(file: File): string | null;
  revoke(url: string): void;
}

export class ImagePreviewGenerator implements PreviewGenerator {
  generate(file: File): string | null {
    if (!file || !file.type.startsWith('image/')) {
      return null;
    }

    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      return null;
    }
  }

  revoke(url: string): void {
    if (url) {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to revoke preview URL:', error);
      }
    }
  }
}

export interface Solution {
  id: number;
  substanceName: string;
  description: string;
  molarConcentration: number | null;
  ph: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  likesCount: number;
  isLiked: 0 | 1;
  isCreator: 0 | 1;
}

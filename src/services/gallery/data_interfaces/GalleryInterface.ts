export interface GalleryInterface {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  date: Date;
  highlight: boolean;
  showInHome: boolean;
  createdAt: Date;
  updatedAt: Date;
}

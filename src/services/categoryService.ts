import { 
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  featured: boolean;
}

const COLLECTION_NAME = 'categories';

export async function addCategory(category: Omit<Category, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...category,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...category };
  } catch (error: any) {
    console.error('Error adding category:', error);
    throw new Error(error.message);
  }
}

export async function deleteCategory(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error: any) {
    console.error('Error deleting category:', error);
    throw new Error(error.message);
  }
}

export async function getCategories() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const categories: Category[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      categories.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        image: data.image,
        featured: data.featured
      });
    });

    return categories;
  } catch (error: any) {
    console.error('Error getting categories:', error);
    throw new Error(error.message);
  }
}

import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const COLLECTION_NAME = 'categories';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  featured: boolean;
}

export async function getCategories() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const categories: Category[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
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

export async function addCategory(category: Omit<Category, 'id'>) {
  try {
    // Check authentication
    if (!auth.currentUser) {
      throw new Error('You must be logged in to add categories');
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...category,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser.uid
    });
    return { id: docRef.id, ...category };
  } catch (error: any) {
    console.error('Error adding category:', error);
    throw new Error(error.message);
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check authentication
    if (!auth.currentUser) {
      throw new Error('You must be logged in to delete categories');
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error: any) {
    console.error('Error deleting category:', error);
    throw new Error(error.message);
  }
}

import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const COLLECTION_NAME = 'categories';

export async function getCategories() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return categories;
  } catch (error: any) {
    console.error('Error getting categories:', error);
    throw new Error(error.message);
  }
}

export async function addCategory(category: { name: string }) {
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

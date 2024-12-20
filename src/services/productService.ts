import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product } from '../types';

const COLLECTION_NAME = 'products';

export async function addProduct(product: Omit<Product, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...product };
  } catch (error: any) {
    console.error('Error adding product:', error);
    throw new Error(error.message);
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString()
    });
    return { id, ...product };
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(error.message);
  }
}

export async function deleteProduct(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw new Error(error.message);
  }
}

export async function getProducts(category?: string) {
  try {
    let q = collection(db, COLLECTION_NAME);
    
    if (category) {
      q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
    }

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category
      });
    });

    return products;
  } catch (error: any) {
    console.error('Error getting products:', error);
    throw new Error(error.message);
  }
}

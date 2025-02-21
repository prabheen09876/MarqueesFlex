import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  DocumentData
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config';
import type { Product } from '../types';

const COLLECTION_NAME = 'products';

export async function addProduct(product: Omit<Product, 'id'>) {
  try {
    if (!auth.currentUser) {
      throw new Error('You must be logged in to add products');
    }

    console.log('Current user attempting to add product:', {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email
    });

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser.uid
    });
    return { id: docRef.id, ...product };
  } catch (error: any) {
    console.error('Error adding product:', error);
    throw new Error(error.message);
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to update products');
    }

    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, {
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

    for (const doc of querySnapshot.docs) {
      const data = doc.data() as DocumentData;

      // Handle image URL
      let imageUrl = data.image;
      if (imageUrl && imageUrl.startsWith('gs://')) {
        try {
          const storageRef = ref(storage, imageUrl);
          imageUrl = await getDownloadURL(storageRef);
        } catch (error) {
          console.error('Error getting image URL:', error);
          imageUrl = ''; // Set a default or empty image URL
        }
      }

      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: imageUrl,
        category: data.category
      });
    }

    return products;
  } catch (error: any) {
    console.error('Error getting products:', error);
    throw new Error(error.message);
  }
}

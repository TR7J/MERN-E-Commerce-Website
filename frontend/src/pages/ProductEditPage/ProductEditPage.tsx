import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../../context/Store";
import { getError } from "../../utils";
/* import { Product } from '../types/Product'; */ // Import your Product type if you have one
import { ApiError } from "../../types/ApiError";
import Loading from "../../components/Loading/Loading";
import { Helmet } from "react-helmet-async";
import apiClient from "../../apiClient";
import "./ProductEditPage.css";

// Define the state and action types
interface State {
  loading: boolean;
  error: string;
  loadingUpdate: boolean;
  loadingUpload: boolean;
  errorUpload: string;
}

interface Action {
  type:
    | "FETCH_REQUEST"
    | "FETCH_SUCCESS"
    | "FETCH_FAIL"
    | "UPDATE_REQUEST"
    | "UPDATE_SUCCESS"
    | "UPDATE_FAIL"
    | "UPLOAD_REQUEST"
    | "UPLOAD_SUCCESS"
    | "UPLOAD_FAIL";
  payload?: any;
}

// Define the reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const ProductEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    { loading, error, loadingUpdate, loadingUpload /* errorUpload */ },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    loadingUpdate: false,
    loadingUpload: false,
    errorUpload: "",
  });

  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<string>("");
  /* const [images, setImages] = useState<string[]>([]); */
  const [category, setCategory] = useState<string>("");
  const [countInStock, setCountInStock] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await apiClient.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        /* setImages(data.images); */
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err as ApiError),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await apiClient.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err as ApiError));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const uploadFileHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    forImages: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        "http://localhost:8000/api/upload",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });

      if (!forImages) {
        // setImages([...images, data.image]);
        setImage(data.image);
      } else {
        /* setImages([...images, data.image]); */
      }
      toast.success("Image uploaded successfully. Click Update to apply it");
    } catch (err) {
      toast.error(getError(err as ApiError));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err as ApiError) });
    }
  };

  return (
    <div className="product-edit-container">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <h1 className="product-edit-title">Edit Product : {name}</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error">There was an error: {error}</div>
      ) : (
        <form onSubmit={submitHandler}>
          <div className="product-edit-form-group">
            <label htmlFor="name" className="product-edit-form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="slug" className="product-edit-form-label">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="price" className="product-edit-form-label">
              Price(KSH)
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="image" className="product-edit-form-label">
              Image File
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="imageFile" className="product-edit-form-label">
              Upload Image
            </label>
            <input
              type="file"
              id="imageFile"
              name="file"
              onChange={(e) => uploadFileHandler(e, false)}
              className="product-edit-form-file-input"
            />
            {loadingUpload && <Loading />}
          </div>

          <div className="product-edit-form-group">
            <label htmlFor="category" className="product-edit-form-label">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="brand" className="product-edit-form-label">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="countInStock" className="product-edit-form-label">
              Count In Stock
            </label>
            <input
              type="text"
              id="countInStock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="description" className="product-edit-form-label">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="product-edit-form-textarea"
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              disabled={loadingUpdate}
              className="product-edit-form-button"
            >
              Update
            </button>
            {loadingUpdate && <Loading />}
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductEditPage;

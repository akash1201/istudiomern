import {
    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,
    CATEGORY_DETAILS_REQUEST,
    CATEGORY_DETAILS_SUCCESS,
    CATEGORY_DETAILS_FAIL,
    CATEGORY_DELETE_REQUEST,
    CATEGORY_DELETE_SUCCESS,
    CATEGORY_DELETE_FAIL,
    CATEGORY_CREATE_RESET,
    CATEGORY_CREATE_FAIL,
    CATEGORY_CREATE_SUCCESS,
    CATEGORY_CREATE_REQUEST,
    CATEGORY_UPDATE_REQUEST,
    CATEGORY_UPDATE_SUCCESS,
    CATEGORY_UPDATE_FAIL,
    CATEGORY_UPDATE_RESET,
    CATEGORY_CREATE_REVIEW_REQUEST,
    CATEGORY_CREATE_REVIEW_SUCCESS,
    CATEGORY_CREATE_REVIEW_FAIL,
    CATEGORY_CREATE_REVIEW_RESET,
    CATEGORY_TOP_REQUEST,
    CATEGORY_TOP_SUCCESS,
    CATEGORY_TOP_FAIL,
  } from '../constants/categoryConstants'
  
  export const categoryListReducer = (state = { categories: [] }, action) => {
    switch (action.type) {
      case CATEGORY_LIST_REQUEST:
        return { loading: true, categories: [] }
      case CATEGORY_LIST_SUCCESS:
        return {
          loading: false,
          categories: action.payload.data,
          pages: action.payload.pages,
          page: action.payload.page,
        }
      case CATEGORY_LIST_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }
  
  export const productDetailsReducer = (
    state = { product: { reviews: [] } },
    action
  ) => {
    switch (action.type) {
      case CATEGORY_DETAILS_REQUEST:
        return { ...state, loading: true }
      case CATEGORY_DETAILS_SUCCESS:
        return { loading: false, product: action.payload }
      case CATEGORY_DETAILS_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }
  
  export const productDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case CATEGORY_DELETE_REQUEST:
        return { loading: true }
      case CATEGORY_DELETE_SUCCESS:
        return { loading: false, success: true }
      case CATEGORY_DELETE_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }
  
  export const productCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case CATEGORY_CREATE_REQUEST:
        return { loading: true }
      case CATEGORY_CREATE_SUCCESS:
        return { loading: false, success: true, product: action.payload }
      case CATEGORY_CREATE_FAIL:
        return { loading: false, error: action.payload }
      case CATEGORY_CREATE_RESET:
        return {}
      default:
        return state
    }
  }
  
  export const productUpdateReducer = (state = { product: {} }, action) => {
    switch (action.type) {
      case CATEGORY_UPDATE_REQUEST:
        return { loading: true }
      case CATEGORY_UPDATE_SUCCESS:
        return { loading: false, success: true, product: action.payload }
      case CATEGORY_UPDATE_FAIL:
        return { loading: false, error: action.payload }
      case CATEGORY_UPDATE_RESET:
        return { product: {} }
      default:
        return state
    }
  }
  
  export const productReviewCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case CATEGORY_CREATE_REVIEW_REQUEST:
        return { loading: true }
      case CATEGORY_CREATE_REVIEW_SUCCESS:
        return { loading: false, success: true }
      case CATEGORY_CREATE_REVIEW_FAIL:
        return { loading: false, error: action.payload }
      case CATEGORY_CREATE_REVIEW_RESET:
        return {}
      default:
        return state
    }
  }
  
  export const productTopRatedReducer = (state = { products: [] }, action) => {
    switch (action.type) {
      case CATEGORY_TOP_REQUEST:
        return { loading: true, products: [] }
      case CATEGORY_TOP_SUCCESS:
        return { loading: false, products: action.payload }
      case CATEGORY_TOP_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }
  
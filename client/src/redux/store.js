import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // local storage

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
      user: persistedReducer, // ✅ Correctly placed reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // ✅ Correctly placed middleware
      }),
  });

export const persistor = persistStore(store);

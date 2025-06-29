import { combineReducers, configureStore } from "@reduxjs/toolkit";

import posReducer from "./pos-slice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import expireReducer from "redux-persist-transform-expire";
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["pos"],
  transforms: [
    expireReducer({
      expireMilliseconds: 30 * 60 * 1000,
      key: "root",
      autoExpire: true,
    }),
  ],
  debug: true,
};

const rootReducer = combineReducers({
  pos: posReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

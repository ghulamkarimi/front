"use client";

import { Provider } from "react-redux";

import { ReactNode } from "react";

import axios from "axios";
import { store } from "../store/store";


interface IReduxProviderProps {
  children: ReactNode;
}


axios.defaults.withCredentials = true;

const ReduxProvider = ({ children }: IReduxProviderProps) => {




  return (
    <Provider store={store}>

        {children}
   
    </Provider>
  );
};

export default ReduxProvider;


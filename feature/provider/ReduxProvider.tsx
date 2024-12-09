
"use client";

import { Provider } from "react-redux";
import { store } from "../store/store"; 

interface IReduxProvider {
    children: React.ReactNode;
}

const ReduxProvider = ({ children }: IReduxProvider) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}

export default ReduxProvider;

import React from 'react';

type HeaderContextType = {
    showValues: boolean;
    setShowValues: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HeaderContext = React.createContext<HeaderContextType>({
    showValues: true,
    setShowValues: () => { }
});

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [showValues, setShowValues] = React.useState<boolean>(true);

    return (
        <HeaderContext.Provider value={{ showValues, setShowValues }}>
            {children}
        </HeaderContext.Provider>
    );
};
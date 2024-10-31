import { banks } from "~/constants/banks";

// Função para obter o logo do banco
export const getBankLogo = (bankName: string) => {
    return banks[bankName] || require('../assets/images/banks/default.png');
};

export const formatValue = (value: number) => {
    return value.toFixed(2).replace('.', ',');
}
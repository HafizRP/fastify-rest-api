import { CreateProductInput } from "../../src/modules/product/product.schema";
import { CreateUserInput } from "../../src/modules/user/user.schema";

export const user: CreateUserInput = {
    name: "Hafiz",
    email: "Kepoloe123@gmail.com",
    password: "kepoloe123",
};

export const product: CreateProductInput = {
    price: 30000,
    title: "New Product",
    content: "This is a new Product",
    ownerId: 0 // Value must be edited
}
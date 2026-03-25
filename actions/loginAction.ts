"use server";

export function loginAction(prevState: any, formData: FormData) {

    try {
    console.log(formData.get("email"));
    console.log(formData.get("password"));
    } catch (error) {
        return { error: "Unexpected error occured"};
    }
    return{error: null};
}

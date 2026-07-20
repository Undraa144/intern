import { Suspense } from "react";
import SignUp from "./signup";

export default function SignUpPage(){
    return(
        <Suspense fallback={null}>
          <SignUp/>
        </Suspense>
    )
}

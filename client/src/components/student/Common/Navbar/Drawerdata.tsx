import React, { useState } from "react"
import Signin from "../../../auth/StudentLoginModal";
import { useSelector} from "react-redux";
import { RootState } from "../../../../redux/store";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "/", current: true },
  { name: "Courses", href: "/courses", current: false },
  { name: "Profile", href: "/profile", current: false },

];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Data = () => {
  const [isSigninOpen, setSigninOpen] = useState(false);
  const user = useSelector((store: RootState) => store.user.user);
  return (
    <div className="rounded-md max-w-sm w-full mx-auto">
      <div className="flex-1 space-y-4 py-1">
        <div className="sm:block">
          <div className="space-y-1 px-5 pt-2 pb-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "text-black hover:opacity-100"
                    : "hover:text-black hover:opacity-100",
                  "py-1 text-lg font-normal opacity-75 block"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </a>
            ))}
          {!user ? (
  <div className="flex flex-col items-start p-1 mt-2">
    {/* Align the buttons based on drawer size */}
    <button
      className="mb-4 bg-Blueviolet text-white px-4 py-2 rounded"
      onClick={() => setSigninOpen(true)}
    >
      Log In
    </button>
    <button className="bg-green-500 text-white px-4 py-2 rounded">
      Register
    </button>

    {/* Render the Signdialog */}
    <Signin isOpen={isSigninOpen} closeModal={() => setSigninOpen(false)} />
  </div>
) : (
  // Your content when the user is logged in
  <div>Welcome, {user.name}!</div>
)}

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;



// import React from "react";
// import Signdialog from "../../../auth/StudentLogin";
// import Registerdialog from "../../../auth/StudentSignup";
// import InstructorSignIn from "../../../auth/instructorLogin";

// interface NavigationItem {
//   name: string;
//   href: string;
//   current: boolean;
// }

// const navigation: NavigationItem[] = [
//   { name: 'Home', href: '/', current: true },
//   { name: 'Courses', href: '#courses', current: false },
//   { name: 'Mentor', href: '#mentor', current: false },
//   { name: 'Group', href: '#/', current: false },
//   { name: 'Testimonial', href: '#testimonial', current: false },
// ];

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(' ');
// }

// const Data = () => {
//   return (
//     <div className="rounded-md max-w-sm w-full mx-auto">
//       <div className="flex-1 space-y-4 py-1">
//         <div className="sm:block">
//           <div className="space-y-1 px-5 pt-2 pb-3">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className={classNames(
//                   item.current ? 'text-black hover:opacity-100' : 'hover:text-black hover:opacity-100',
//                   'py-1 text-lg font-normal opacity-75 block'
//                 )}
//                 aria-current={item.current ? 'page' : undefined}
//               >
//                 {item.name}
//               </a>
//             ))}
//             <div className="mt-4"></div>
             
//              <Signdialog />
            
                  
//                     <InstructorSignIn/>
//                     <Registerdialog />
//             {/* <button className="bg-white w-full text-Blueviolet border border-semiblueviolet font-medium py-2 px-4 rounded">
//               Log In
              
//             </button> */}
//             <button className="bg-semiblueviolet w-full hover:bg-Blueviolet hover:text-white text-Blueviolet font-medium my-2 py-2 px-4 rounded">
//               Sign up
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Data;

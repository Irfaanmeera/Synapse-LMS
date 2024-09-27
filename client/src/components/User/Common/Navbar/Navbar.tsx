import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "../../../auth/StudentLogin";
import Registerdialog from "../../../auth/StudentSignup";

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', current: true },
    { name: 'Courses', href: '#courses', current: false },
    { name: 'Mentor', href: '#mentor', current: false },
    // { name: 'Group', href: '/', current: false },
    { name: 'Testimonial', href: '#testimonial', current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const CustomLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => {
    return (
        <a href={href} onClick={onClick} className="px-3 py-3 text-sm font-normal">
            {children}
        </a>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLink, setCurrentLink] = useState('/');

    const handleLinkClick = (href: string) => {
        setCurrentLink(href);
    };

    return (
        <Disclosure as="nav" className="navbar">
            <>
                <div className="mx-auto max-w-7xl px-2 lg:px-3">
                    <div className="relative flex h-10 md:h-20 items-center justify-between">
                        <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">

                            {/* LOGO */}

                            <div className="flex flex-shrink-0 items-center">
                                {/* Update the logo src path as per your project */}
                                <img
                                    className="hidden h-25 w-80 lg:block"
                                    src={'/assets/logo/Modern_Educational_Logo_Template_-removebg-preview (1).png'}
                                    alt="design-logo"
                                />
                            </div>

                            {/* LINKS */}

                            <div className="hidden lg:block m-auto">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <CustomLink
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => handleLinkClick(item.href)}
                                        >
                                            <span
                                                className={classNames(
                                                    item.href === currentLink ? 'underline-links' : 'text-slategray',
                                                    'px-2 py-3 text-base font-normal opacity-75 hover:opacity-100'
                                                )}
                                                aria-current={item.href ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </span>
                                        </CustomLink>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SIGNIN DIALOG */}

                        <Signdialog />

                        {/* REGISTER DIALOG */}

                        <Registerdialog />

                        {/* DRAWER FOR MOBILE VIEW */}

                        <div className='block lg:hidden'>
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" onClick={() => setIsOpen(true)} />
                        </div>

                        <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                            <Drawerdata />
                        </Drawer>
                    </div>
                </div>
            </>
        </Disclosure>
    );
};

export default Navbar;

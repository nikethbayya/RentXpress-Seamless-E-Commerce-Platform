import { BsCheckCircleFill } from "react-icons/bs";
import {useRef, useState,Fragment} from "react";
import {useNavigate} from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react';
export const SuccessPopup = (props) => {
    const [open, setOpen] = useState(true);

    const cancelButtonRef = useRef(null);
    const navigate = useNavigate();
    const handleClick = (redirect) => {
        setOpen(false);
        navigate(redirect);
    }
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-fullsm:mx-0 sm:h-10 sm:w-10">
                                        <BsCheckCircleFill className="h-6 w-6" color='green' aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-center">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            {props.message} Successfully
                                        </Dialog.Title>
                                    </div>
                                </div>
                                <div className="px-3 py-2 pb-4 sm:px-4 text-center">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-dark-green sm:ml-3 sm:w-auto"
                                        onClick={() => {handleClick(props.redirect)}}
                                    >
                                        Go back to {props.page} Page
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
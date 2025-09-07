'use client'

import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { boolean } from 'zod';
import Image from 'next/image';
import { Button } from './ui/button';
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.action';
import { useRouter } from 'next/navigation';

const OTPModal = ({ accountId, email }: { accountId: string, email: string }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [passcode, setPasscode] = useState<string>("");
    const [isLoading, setisLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setisLoading(true);

        try {
            // Call your API to verify the OTP
            const sessionId = await verifySecret({ accountId, password: passcode });
            if (sessionId) {
                router.push("/");
            }   

        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
        finally {
            setisLoading(false);
        }
    }

    const handleResendOtp = async () => {
        await sendEmailOTP(email);
    }


    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className='!shad-alert-dialog'>
                <AlertDialogHeader className='relative flex justify-center'>
                    <AlertDialogTitle className='h2 text-center'>
                        Enter your OTP

                        <Image
                            src="/assets/icons/close-dark.svg" alt='close'
                            width={20}
                            height={20}
                            onClick={() => setIsOpen(false)}
                            className='!otp-close-button'
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
                        We&apos;ve sent a code to {" "} <span className='pl-1 text-brand'>{email}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <InputOTP maxLength={6} value={passcode} onChange={setPasscode}>
                    <InputOTPGroup className='!shad-otp'>
                        <InputOTPSlot index={0} className='!shad-otp-slot' />
                        <InputOTPSlot index={1} className='!shad-otp-slot' />
                        <InputOTPSlot index={2} className='!shad-otp-slot' />
                        <InputOTPSlot index={3} className='!shad-otp-slot' />
                        <InputOTPSlot index={4} className='!shad-otp-slot' />
                        <InputOTPSlot index={5} className='!shad-otp-slot' />
                    </InputOTPGroup>
                </InputOTP>
                <AlertDialogFooter>
                    <div className='flex w-full flex-col gap-4'>
                        <AlertDialogAction
                            onClick={handleSubmit}
                            className='!shad-submit-btn h-12'
                            type='button'
                        >Submit
                            {isLoading && <Image
                                src="/assets/icons/loader.svg"
                                alt="loader"
                                width={24}
                                height={24}
                                className='ml-2 animate-spin'
                            />}
                        </AlertDialogAction>
                                <div className='subtitle-2 text-center text-light-100 mt-2'>
                                    Didn&apos;t receive the code?{" "}
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="pl-1 text-brand"
                                        onClick={handleResendOtp}
                                    
                                    >
                                        Click to resend
                                    </Button>
                                </div>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default OTPModal
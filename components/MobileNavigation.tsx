'use client'

import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,

} from "@/components/ui/sheet"
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { navItems } from '@/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import FileUploader from './FileUploader'
import { Button } from './ui/button'
import { signOut } from '@/lib/actions/user.action'

interface Props {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({ $id: ownerId, accountId, fullName, avatar, email }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <header className='!mobile-header'>
      <Image
        src="assets/icons/logo-full-brand.svg"
        alt='logo'
        width={120}
        height={52}
        className='h-auto'
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt='search'
            width={30}
            height={30}

          />
        </SheetTrigger>
        <SheetContent id='shad-sheet' className='!shad-sheet h-screen px-3'>
          <SheetTitle>
            <div className="!header-user">
              <Image
                src={avatar}
                alt='avatar'
                width={44}
                height={44}
                className='!header-user-avatar'
              />
              <div className="sm:hidden md:block">
                <p className='subtitle-2 capitalize'>
                  {fullName}
                </p>

                <p className='caption'>
                  {email}
                </p>
              </div>
            </div>
            <Separator className='mb-4 bg-light-200/20' />

          </SheetTitle>
          <nav className='!mobile-nav'>
            <ul className="!mobile-nav-list">
              {navItems.map((item, index) => {

                return (
                  <Link
                    href={item.url}
                    key={index}
                    className='md:w-full'
                  >
                    <li
                      className={
                        cn("!mobile-nav-item",
                          pathname === item.url && "!shad-active")}>
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        className={
                          cn("!nav-icon",
                            pathname === item.url && "!nav-icon-active"
                          )
                        }
                      />
                      <p >{item.name}</p>
                    </li>

                  </Link>
                );
              })}
            </ul>
          </nav>
          <Separator className='mt-4 bg-light-200/20' />
          <div className='flex flex-col justify-between gap-5 pb-5'>
            <FileUploader ownerId={ownerId} accountId={accountId}/>

            <form action="">
              <Button type='submit'
                className='!mobile-sign-out-button'
                onClick={async () => {await signOut()}}
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logo"
                  width={24}
                  height={24}
                  className='w-6'
                />
                <p>Log out</p>
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNavigation
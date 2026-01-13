import React from 'react';
import styles from './chat.module.scss';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"

const Chat: React.FC = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <main>
        <SidebarTrigger />
        {children}
      </main> */}
    </SidebarProvider>
  );
};

export default Chat;

import {ColorSchemeProvider, MantineProvider} from '@mantine/core';
import {NotificationsProvider} from '@mantine/notifications';
import {useHotkeys, useLocalStorageValue} from '@mantine/hooks';
import React from 'react';

export default function Providers({children}) {
    const [colorScheme, setColorScheme] = useLocalStorageValue({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
    });

    const toggleColorScheme = (value) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    useHotkeys([['ctrl+j', () => toggleColorScheme()]]);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{colorScheme}}>
                <NotificationsProvider>
                    {children}
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

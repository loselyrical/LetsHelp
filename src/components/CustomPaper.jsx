import React from 'react';
import {Paper} from "@mantine/core";

function CustomPaper({children}) {
    return (
        <Paper
            pt={'sm'}
            mb={'lg'}
            px={'sm'}
            radius={10}
            shadow={'xs'}
            sx={(theme) => ({
                border: '2px solid ',
                borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
                position: 'relative',
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            })}
        >
            {children}
        </Paper>
    );
}

export default CustomPaper;

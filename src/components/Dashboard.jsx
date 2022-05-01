import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import FundRiserCard from "./FundRiserCard";
import FundRiserForm from "./FundRiserForm";
import {ReloadIcon} from "@modulz/radix-icons";
import {ActionIcon, Grid, Group, Loader, SimpleGrid, Text, TypographyStylesProvider} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {getAllFunding} from "../redux/interactions";

export const CustomLoader = () => (
    <Loader
        style={{
            display: 'flex',
            marginLeft: 'auto',
            marginRight: 'auto',
            minWidth: '84px',
            height: '100vh',
        }}
    />
);

const Dashboard = () => {
    const dispatch = useDispatch()
    const projectsList = useSelector(state => state.projectReducer.projects)
    const matches = useMediaQuery('(min-width: 993px)');
    const web3 = useSelector(state => state.web3Reducer.connection)
    const crowdFundingContract = useSelector(state => state.fundingReducer.contract)
    const account = useSelector(state => state.web3Reducer.account)

    const [chainId, setChainId] = useState(null)
    const networkId = async () => {
        const c = await web3?.eth.net.getId()
        setChainId(c)
    }
    useEffect(() => {
        networkId()
    }, [web3])

    if (account === undefined)
        return <TypographyStylesProvider>
            <Group position={'center'}>
                <Text weight={700} style={{fontSize: '25px'}} mt={'xl'} color={'red'}>
                    Connect your wallet!
                </Text>
            </Group>
        </TypographyStylesProvider>

    if (chainId !== 97)
        return <TypographyStylesProvider>
            <Group position={'center'}>
                <Text weight={700} style={{fontSize: '25px'}} mt={'xl'} color={'red'}>
                    Switch to BSC Testnet Network
                </Text>
            </Group>
        </TypographyStylesProvider>

    return (
        <Grid columns={24} style={{flexDirection: !matches ? 'column-reverse' : ''}}>
            <Grid.Col xl={15} lg={15} md={14}>
                {projectsList !== undefined &&
                    projectsList.length > 0 &&
                    <Group mb={'md'} style={{width: '100%'}} position={'center'}>
                        <ActionIcon onClick={() => getAllFunding(crowdFundingContract, web3, dispatch)}>
                            <ReloadIcon/>
                        </ActionIcon>
                    </Group>
                }
                <SimpleGrid>
                    {projectsList !== undefined ?
                        projectsList.length > 0 ?
                            projectsList.map((data, i) => (
                                <FundRiserCard props={data} key={i}/>
                            ))
                            : <TypographyStylesProvider>
                                <Group mt={'xl'} position={'center'}>
                                    <Text weight={700} style={{fontSize: '30px'}} color={'red'}>
                                        No project found !
                                    </Text>
                                </Group>
                            </TypographyStylesProvider>
                        : <CustomLoader/>
                    }
                </SimpleGrid>
            </Grid.Col>
            <Grid.Col xl={9} lg={9} md={10}>
                <FundRiserForm/>
            </Grid.Col>
        </Grid>
    );
};

export default Dashboard;

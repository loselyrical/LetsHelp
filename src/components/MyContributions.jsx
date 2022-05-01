import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMyContributionList } from "../redux/interactions";
import { CustomLoader } from "./Dashboard";
import {
  Avatar,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { minifyAddress } from "../helper/helper";

const MyContributions = () => {
  const crowdFundingContract = useSelector(
    (state) => state.fundingReducer.contract
  );
  const account = useSelector((state) => state.web3Reducer.account);
  const [contributions, setContributions] = useState(null);
  const [chainId, setChainId] = useState(null);
  const web3 = useSelector((state) => state.web3Reducer.connection);

  const networkId = async () => {
    const c = await web3?.eth.net.getId();
    setChainId(c);
  };

  useEffect(() => {
    networkId();
  }, [web3]);

  useEffect(() => {
    (async () => {
      if (crowdFundingContract && account !== undefined) {
        const res = await getMyContributionList(crowdFundingContract, account);
        setContributions(res);
      }
    })();
  }, [crowdFundingContract]);

  if (account === undefined)
    return (
      <TypographyStylesProvider>
        <Group position={"center"}>
          <Text
            weight={700}
            style={{ fontSize: "25px" }}
            mt={"xl"}
            color={"red"}
          >
            Connect your wallet!
          </Text>
        </Group>
      </TypographyStylesProvider>
    );

  if (chainId !== 97)
    return (
      <TypographyStylesProvider>
        <Group position={"center"}>
          <Text
            weight={700}
            style={{ fontSize: "25px" }}
            mt={"xl"}
            color={"red"}
          >
            Switch to BSC Testnet Network!
          </Text>
        </Group>
      </TypographyStylesProvider>
    );

  return (
    <>
      {contributions ? (
        contributions.length > 0 ? (
          contributions.map((data, i) => (
            <Paper
              mr={"md"}
              mb={"md"}
              radius={10}
              shadow={"xs"}
              sx={(theme) => ({
                border: "2px solid ",
                borderColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[7]
                    : theme.colors.gray[1],
                position: "relative",
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[0],
              })}
            >
              <Group pl={"xs"} py={"md"}>
                <Avatar size={"lg"} />
                <Stack spacing={"xs"}>
                  <Text weight={500}>{minifyAddress(data.projectAddress)}</Text>
                  <Text>{data.amount} BNB</Text>
                </Stack>
              </Group>
              <Divider mt={5} style={{ width: "100%" }} />
            </Paper>
          ))
        ) : (
          <TypographyStylesProvider>
            <Group position={"center"}>
              <Text
                weight={700}
                style={{ fontSize: "25px" }}
                mt={"xl"}
                color={"red"}
              >
                You didn't contributed in any project yet !
              </Text>
            </Group>
          </TypographyStylesProvider>
        )
      ) : (
        <CustomLoader />
      )}
    </>
  );
};

export default MyContributions;

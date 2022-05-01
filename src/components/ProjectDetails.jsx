import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FundRiserCard from "./FundRiserCard";
import WithdrawRequestCard from "./WithdrawRequestCard";
import { getAllWithdrawRequest, getContributors } from "../redux/interactions";
import { useParams } from "react-router-dom";
import { CustomLoader } from "./Dashboard";
import {
  Avatar,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import CustomPaper from "./CustomPaper";
import { minifyAddress } from "../helper/helper";
import Web3 from "web3";

const ProjectDetails = () => {
  const { id } = useParams();
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const projectsList = useSelector((state) => state.projectReducer.projects);
  const filteredProject = projectsList?.filter((data) => data.address === id);
  const account = useSelector((state) => state.web3Reducer.account);

  const [contributors, setContributors] = useState(null);
  const [withdrawReq, setWithdrawReq] = useState(null);
  const matches = useMediaQuery("(min-width: 993px)");

  const newWeb3 = new Web3(
    "https://speedy-nodes-nyc.moralis.io/1bc6ab7c0b31a8e30ffc9cfb/bsc/testnet/archive"
  );

  useEffect(() => {
    if (id) {
      const onSuccess = (data) => {
        setContributors(data);
      };

      const onError = (error) => {
        console.log(error);
      };

      getContributors(newWeb3, id, onSuccess, onError);

      const loadWithdrawRequests = (data) => {
        setWithdrawReq(data);
      };

      getAllWithdrawRequest(web3, id, loadWithdrawRequests);
    }
  }, [id, web3]);

  const pushWithdrawRequests = (data) => {
    if (withdrawReq) {
      setWithdrawReq([...withdrawReq, data]);
    } else {
      setWithdrawReq([data]);
    }
  };

  return (
    <Grid
      columns={24}
      style={{ flexDirection: !matches ? "column-reverse" : "" }}
    >
      <Grid.Col xl={19} lg={19} md={18}>
        {filteredProject ? (
          <FundRiserCard
            props={filteredProject[0]}
            pushWithdrawRequests={pushWithdrawRequests}
          />
        ) : (
          <CustomLoader />
        )}

        <div>
          {withdrawReq ? (
            withdrawReq.length > 0 ? (
              <div>
                <TypographyStylesProvider>
                  <Title color={"gray"}>Withdraw requests</Title>
                </TypographyStylesProvider>
                {withdrawReq.map((data, i) => (
                  <WithdrawRequestCard
                    props={data}
                    withdrawReq={withdrawReq}
                    setWithdrawReq={setWithdrawReq}
                    contractAddress={id}
                    key={i}
                  />
                ))}
              </div>
            ) : (
              <Group position={"center"}>
                <Text weight={700} mt={"md"} size={"xl"} color={"red"}>
                  Withdraw requests not found
                </Text>
              </Group>
            )
          ) : (
            <CustomLoader />
          )}
        </div>
      </Grid.Col>
      <Grid.Col xl={5} lg={5} md={6}>
        <CustomPaper>
          <Title order={2}>All contributors:</Title>
          {contributors ? (
            contributors.length > 0 ? (
              contributors.map((data, i) => (
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
                      <Text weight={500}>
                        {minifyAddress(data.contributor)}
                      </Text>
                      <Text>{data.amount} BNB</Text>
                    </Stack>
                  </Group>
                </Paper>
              ))
            ) : (
              <Text mb={"sm"} color="red">
                Contributors not found
              </Text>
            )
          ) : (
            <CustomLoader />
          )}
        </CustomPaper>
      </Grid.Col>
    </Grid>
  );
};

export default ProjectDetails;

/*
                                    <div className='inner-card my-2 flex flex-row' key={i}>
                                        <div className='lg:w-1/5'>
                                            <div className='p-6 w-8 h-8 mx-auto my-auto rounded-md bg-slate-300 '></div>
                                        </div>
                                        <div className='lg:w-4/5'>
                                            <p className='text-md font-bold text-gray-800 w-40 truncate '>{data.contributor}</p>
                                            <p className='text-sm font-bold text-gray-500'>{data.amount} BNB</p>
                                        </div>
                                    </div>
 */

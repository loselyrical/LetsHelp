import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { toastError, toastSuccess } from '../helper/toastMessage';
import {
  getContributors,
  voteWithdrawRequest,
  withdrawAmount,
} from "../redux/interactions";
import { showNotification } from "@mantine/notifications";
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { minifyAddress } from "../helper/helper";
import { useParams } from "react-router-dom";

const WithdrawRequestCard = ({
  props,
  withdrawReq,
  setWithdrawReq,
  contractAddress,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [btnLoader, setBtnLoader] = useState(false);
  const account = useSelector((state) => state.web3Reducer.account);
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const [contributors, setContributors] = useState(null);

  useEffect(() => {
    if (id) {
      const onSuccess = (data) => setContributors(data);
      const onError = (error) => console.log(error);
      getContributors(web3, id, onSuccess, onError);
    }
  }, [id, web3]);

  const withdrawBalance = (reqId) => {
    setBtnLoader(reqId);
    var data = {
      contractAddress: contractAddress,
      reqId: reqId,
      account: account,
      amount: props.amount,
    };
    const onSuccess = () => {
      setBtnLoader(false);
      const filteredReq = withdrawReq.filter(
        (data) => data.requestId === props.requestId
      );
      var filteredVal = filteredReq[0];
      filteredVal.status = "Completed";
      setWithdrawReq([...withdrawReq, filteredVal]);
      showNotification({
        title: "Successful!",
        message: `Vote successfully added for request id ${reqId}`,
        color: "blue",
      });
    };
    const onError = (message) => {
      setBtnLoader(false);
      showNotification({
        title: "Warning!",
        message: message,
        color: "red",
      });
    };
    withdrawAmount(web3, dispatch, data, onSuccess, onError);
  };

  const vote = (reqId) => {
    setBtnLoader(reqId);
    var data = {
      contractAddress: contractAddress,
      reqId: reqId,
      account: account,
    };
    const onSuccess = () => {
      setBtnLoader(false);
      const filteredReq = withdrawReq.filter(
        (data) => data.requestId === props.requestId
      );
      var filteredVal = filteredReq[0];
      filteredVal.totalVote = Number(filteredVal.totalVote) + 1;
      setWithdrawReq([...withdrawReq, filteredVal]);
      showNotification({
        title: "Successful!",
        message: `Vote successfully added for request id ${reqId}`,
        color: "blue",
      });
    };
    const onError = (message) => {
      setBtnLoader(false);
      showNotification({
        title: "Warning!",
        message: message,
        color: "red",
      });
    };
    voteWithdrawRequest(web3, data, onSuccess, onError, dispatch);
  };

  return (
    <Card pt={0} shadow="sm" p="lg">
      <Card.Section mt={"sm"} px={"md"}>
        <Group position={"apart"}>
          <Title pb={"sm"} order={3}>
            {props.desc}
          </Title>

          <Badge color={props.status !== "Pending" ? "red" : "green"}>
            {props.status}
          </Badge>
        </Group>
        <Grid>
          <Grid.Col xl={6} lg={6} md={6}>
            <Paper
              p={"xs"}
              radius={10}
              shadow={"xs"}
              sx={(theme) => ({
                border: "2px solid ",
                borderColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
                position: "relative",
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
              })}
            >
              <Text>Requested amount [BNB]</Text>
              <Text>{props.amount}</Text>
              <Divider mt={5} style={{ width: "100%" }} />
              <Text>Total vote</Text>
              <Text>{props.totalVote}</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col xl={6} lg={6} md={6}>
            <Paper
              p={"xs"}
              radius={10}
              shadow={"xs"}
              sx={(theme) => ({
                border: "2px solid ",
                borderColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
                position: "relative",
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
              })}
            >
              <Text>
                <Text weight={700}>Reciptant address:</Text>
                {minifyAddress(props.reciptant)}
              </Text>
              <Divider mt={5} mb={"xs"} style={{ width: "100%" }} />
              {account?.toUpperCase() === props.reciptant?.toUpperCase() &&
                props.totalVote >= contributors?.length / 2 && (
                  <Button
                    loading={btnLoader === props.requestId}
                    fullWidth
                    onClick={() => withdrawBalance(props.requestId)}
                    disabled={props.status === "Completed"}
                  >
                    Withdraw
                  </Button>
                )}

              {account.toUpperCase() !== props.reciptant.toUpperCase() &&
                contributors?.find(
                  (item) =>
                    item.contributor.toUpperCase() === account.toUpperCase()
                ) !== undefined &&
                props.status !== "Completed" && (
                  <Button
                    loading={btnLoader === props.requestId}
                    onClick={() => vote(props.requestId)}
                  >
                    Vote
                  </Button>
                )}
            </Paper>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
};

export default WithdrawRequestCard;

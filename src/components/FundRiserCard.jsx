import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { contribute, createWithdrawRequest } from "../redux/interactions";
import { etherToWei } from "../helper/helper";
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  NumberInput,
  Paper,
  Progress,
  Spoiler,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

const FundRiserCard = ({ props, pushWithdrawRequests }) => {
  const navigate = useNavigate();

  const [btnLoader, setBtnLoader] = useState(false);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const crowdFundingContract = useSelector(
    (state) => state.fundingReducer.contract
  );
  const account = useSelector((state) => state.web3Reducer.account);
  const web3 = useSelector((state) => state.web3Reducer.connection);

  const contributeAmount = (projectId, minContribution) => {
    if (amount < minContribution) {
      showNotification({
        title: "Warning!",
        message: `Minimum contribution amount is ${minContribution} [BNB]`,
        color: "red",
      });
      return;
    }

    setBtnLoader(projectId);
    const contributionAmount = etherToWei(amount);

    const data = {
      contractAddress: projectId,
      amount: contributionAmount,
      account: account,
    };
    const onSuccess = () => {
      setBtnLoader(false);
      setAmount(0);
      showNotification({
        title: "Successful!",
        message: `Successfully contributed ${amount} BNB`,
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
    contribute(crowdFundingContract, data, dispatch, onSuccess, onError);
  };

  const requestForWithdraw = (projectId) => {
    setBtnLoader(projectId);
    const contributionAmount = etherToWei(amount);

    const data = {
      description: `${amount} BNB requested for withdraw`,
      amount: contributionAmount,
      recipient: account,
      account: account,
    };
    const onSuccess = (data) => {
      setBtnLoader(false);
      setAmount(0);
      if (pushWithdrawRequests) {
        pushWithdrawRequests(data);
      }
      showNotification({
        title: "Successful!",
        message: `Successfully requested for withdraw ${amount} BNB`,
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
    createWithdrawRequest(web3, projectId, data, onSuccess, onError, dispatch);
  };

  return (
    <Card shadow="sm" p="lg">
      <Card.Section style={{ position: "relative" }}>
        <Image
          src={"https://ipfs.infura.io/ipfs/" + props.image}
          height={200}
          alt="Norway"
        />
        <Badge
          size={"xl"}
          style={{
            cursor: "pointer",
            position: "absolute",
            bottom: "14px",
            left: "46%",
          }}
          onClick={() => navigate(`/project-details/${props.address}`)}
        >
          {props.title}
        </Badge>
        <Badge
          size={"sm"}
          variant={"filled"}
          color={props.state == "Successful" ? "green" : "red"}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
          }}
        >
          {props.state}
        </Badge>
      </Card.Section>

      <Card.Section mt={"sm"}>
        <Spoiler
          px={"lg"}
          maxHeight={45}
          showLabel="Show more"
          hideLabel="Hide"
        >
          {props.description}
        </Spoiler>
      </Card.Section>

      {props.state !== "Successful" && (
        <Card.Section px={"md"} mt={"sm"}>
          <Progress
            animate
            value={props.progress}
            label={props.progress}
            size="xl"
            radius="xl"
          />
        </Card.Section>
      )}
      <Card.Section mt={"sm"}>
        <Grid px={"md"}>
          <Grid.Col xl={6} lg={6} md={6}>
            <Paper
              p={"xs"}
              radius={10}
              shadow={"xs"}
              sx={(theme) => ({
                height: "100%",
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
              <Text>Targeted contribution</Text>
              <Text>{props.goalAmount} BNB</Text>
              <Divider mt={5} style={{ width: "100%" }} />
              <Text>Deadline</Text>
              <Text>{props.deadline}</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col xl={6} lg={6} md={6}>
            <Paper
              p={"xs"}
              radius={10}
              shadow={"xs"}
              sx={(theme) => ({
                height: "100%",
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
              {props.state !== "Successful" ? (
                <>
                  <Text>Contribution amount</Text>
                  <Divider my={"xs"} style={{ width: "100%" }} />
                  <Group direction={"row"} style={{ width: "100%" }}>
                    <NumberInput
                      style={{ width: "45%" }}
                      defaultValue={0.00001}
                      placeholder="Targeted contribution amount [BNB]"
                      required
                      decimalSeparator=","
                      min={0.00001}
                      precision={5}
                      value={amount}
                      onChange={(val) => setAmount(val)}
                    />
                    <Button
                      loading={btnLoader === props.address}
                      onClick={() =>
                        contributeAmount(props.address, props.minContribution)
                      }
                      style={{ width: "45%" }}
                    >
                      Contribute
                    </Button>
                  </Group>
                  <Text>
                    Minimum contribution is {props.minContribution} BNB
                  </Text>
                </>
              ) : (
                <>
                  <Text>Contract balance</Text>
                  <Text>{props.contractBalance} BNB</Text>
                  <Divider my={"xs"} style={{ width: "100%" }} />
                  {props?.creator?.toUpperCase() === account?.toUpperCase() &&
                    props.state === "Successful" &&
                    props.contractBalance >= 0 && (
                      <Group direction={"row"} style={{ width: "100%" }}>
                        <NumberInput
                          style={{ width: "45%" }}
                          defaultValue={0.00001}
                          required
                          decimalSeparator=","
                          min={0.00001}
                          precision={5}
                          value={amount}
                          onChange={(val) => setAmount(val)}
                        />
                        <Button
                          loading={btnLoader === props.address}
                          onClick={() => requestForWithdraw(props.address)}
                          style={{ width: "45%" }}
                        >
                          Withdraw
                        </Button>
                      </Group>
                    )}
                </>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
};

export default FundRiserCard;

import React, { useState } from "react";
import moment from "moment";
import { startFundRaising } from "../redux/interactions";
import { useDispatch, useSelector } from "react-redux";
import { etherToWei } from "../helper/helper";
import {
  Button,
  Group,
  Image,
  NumberInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import DropzoneArea from "./DropzoneArea";
import CustomPaper from "./CustomPaper";
import { showNotification } from "@mantine/notifications";
import { create } from "ipfs-http-client";

const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const FundRiserForm = () => {
  const dispatch = useDispatch();
  const crowdFundingContract = useSelector(
    (state) => state.fundingReducer.contract
  );
  const account = useSelector((state) => state.web3Reducer.account);
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetedContributionAmount, setTargetedContributionAmount] =
    useState(0);
  const [minimumContributionAmount, setMinimumContributionAmount] = useState(0);
  const [deadline, setDeadline] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [buffer, setBuffer] = useState(null);

  const riseFund = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const unixDate = moment(deadline).valueOf();
    const result = await ipfs.add(buffer);

    const onSuccess = () => {
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setTargetedContributionAmount(0);
      setMinimumContributionAmount(0);
      setDeadline(new Date());
      showNotification({
        title: "Successful!",
        message: `Fund rising started 🎉`,
        color: "blue",
      });
    };

    const onError = (error) => {
      setBtnLoading(false);
      showNotification({
        title: "Warning!",
        message: error,
        color: "red",
      });
    };

    const data = {
      minimumContribution: etherToWei(minimumContributionAmount),
      deadline: Number(unixDate),
      targetContribution: etherToWei(targetedContributionAmount),
      projectTitle: title,
      projectDesc: description,
      account: account,
      image: result.path,
    };

    startFundRaising(
      web3,
      crowdFundingContract,
      data,
      onSuccess,
      onError,
      dispatch
    );
  };

  return (
    <CustomPaper>
      <Text size={"xl"} weight={700} color={"blue"}>
        Start a funding project
      </Text>
      <TextInput
        mt="md"
        placeholder="Title"
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />
      <Textarea
        mt="md"
        placeholder="Description"
        label="Description"
        autosize
        minRows={2}
        maxRows={4}
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      <NumberInput
        mt="md"
        defaultValue={0.00001}
        placeholder="Targeted contribution amount [BNB]"
        label="Targeted contribution amount [BNB]"
        decimalSeparator=","
        min={0.00001}
        precision={5}
        mb={"lg"}
        value={targetedContributionAmount}
        onChange={(val) => setTargetedContributionAmount(val)}
      />
      <NumberInput
        mt="md"
        defaultValue={0.00001}
        placeholder="Minimum contribution amount [BNB]"
        label="Minimum contribution amount [BNB]"
        decimalSeparator=","
        min={0.00001}
        precision={5}
        mb={"lg"}
        value={minimumContributionAmount}
        onChange={(val) => setMinimumContributionAmount(val)}
      />
      <DatePicker
        mb={"lg"}
        label="Deadline"
        value={deadline}
        onChange={setDeadline}
      />
      <DropzoneArea setFile={setImage} setBuffer={setBuffer} />
      {image && (
        <Image
          radius="md"
          mt={"lg"}
          height={150}
          alt={`file preview`}
          src={URL.createObjectURL(image)}
        />
      )}
      <Group position="center" my={"xl"}>
        <Button
          disabled={
            btnLoading ||
            title === "" ||
            description === "" ||
            targetedContributionAmount === 0 ||
            minimumContributionAmount === 0 ||
            deadline == null ||
            image == null
          }
          color="blue"
          onClick={(e) => riseFund(e)}
        >
          Start campaign
        </Button>
      </Group>
    </CustomPaper>
  );
};

export default FundRiserForm;

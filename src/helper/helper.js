import moment from "moment";
import web3 from "web3";
import _ from "lodash";

export const minifyAddress = (address) => {
  return address.slice(0, 5) + "..." + address.slice(-4);
};

export const weiToEther = (num) => {
  return web3.utils.fromWei(num, "ether");
};

export const etherToWei = (num) => {
  const weiBigNumber = web3.utils.toWei(num.toString(), "ether");
  const wei = weiBigNumber.toString();
  return wei;
};

export const unixToDate = (unixDate) => {
  return moment(unixDate).format("DD/MM/YYYY");
};

export const state = ["Fundraising", "Expired", "Successful"];

export const projectDataFormatter = (data, contractAddress) => {
  const formattedData = {
    address: contractAddress,
    creator: data?.projectStarter,
    contractBalance: data.balance ? weiToEther(data.balance) : 0,
    title: data.title,
    description: data.desc,
    image: data.image,
    minContribution: weiToEther(data.minContribution),
    goalAmount: weiToEther(data.goalAmount),
    currentAmount: weiToEther(data.currentAmount),
    state: state[Number(data.currentState)],
    deadline: unixToDate(Number(data.projectDeadline)),
    progress: Math.round(
      (Number(weiToEther(data.currentAmount)) /
        Number(weiToEther(data.goalAmount))) *
        100
    ),
  };
  return formattedData;
};

const formatProjectContributions = (contributions) => {
  const formattedData = contributions.map((data) => {
    return {
      projectAddress: data.returnValues.projectAddress,
      contributor: data.returnValues.contributor,
      amount: Number(weiToEther(data.returnValues.contributedAmount)),
    };
  });
  return formattedData;
};

export const groupContributionByProject = (contributions) => {
  const contributionList = formatProjectContributions(contributions);
  return contributionList;
};

const formatContribution = (contributions) => {
  const formattedData = contributions.map((data) => {
    return {
      contributor: data.returnValues.contributor,
      amount: Number(weiToEther(data.returnValues.amount)),
    };
  });
  return formattedData;
};

export const groupContributors = (contributions) => {
  const contributorList = formatContribution(contributions);
  const contributorGroup = _.map(
    _.groupBy(contributorList, "contributor"),
    (o, address) => {
      return { contributor: address, amount: _.sumBy(o, "amount") };
    }
  );
  return contributorGroup;
};

export const withdrawRequestDataFormatter = (data) => {
  return {
    requestId: data.requestId,
    totalVote: data.noOfVotes,
    amount: weiToEther(data.amount),
    status: data.isCompleted ? "Completed" : "Pending",
    desc: data.description,
    reciptant: data.reciptent,
  };
};

export const connectWithWallet = async (onSuccess) => {
  if (window.ethereum) {
    const eth = window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((res) => {
        if (onSuccess) onSuccess();
        return res;
      })
      .catch((error) => {
        alert(error.message);
      });
    return eth;
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

export const chainOrAccountChangedHandler = () => {
  localStorage.removeItem("ADDRESS");
  window.location.reload();
};

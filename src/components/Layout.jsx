import React from "react";
import {
  AppShell,
  Badge,
  Button,
  Container,
  createStyles,
  Group,
  Header,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ToggleTheme from "./ToggleTheme";
import { useDispatch, useSelector } from "react-redux";
import { loadAccount } from "../redux/interactions";
import { connectWithWallet, minifyAddress } from "../helper/helper";

const useStyles = createStyles((theme) => ({
  inner: {
    height: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

export const HEADER_LINKS = [
  {
    link: "/dashboard",
    label: "Home",
  },
  {
    link: "/my-contribution",
    label: "My contribution",
  },
];

function Layout({ children }) {
  const navigate = useNavigate();
  const { classes } = useStyles(undefined, undefined);
  const dispatch = useDispatch();
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const account = useSelector((state) => state.web3Reducer.account);
  const connect = () => {
    const onSuccess = async () => {
      loadAccount(web3, dispatch);
    };
    connectWithWallet(onSuccess);
  };

  const items = HEADER_LINKS.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => {
          navigate(link.link);
          event.preventDefault();
        }}
      >
        {link.label}
      </a>
    );
  });

  return (
    <AppShell
      padding="md"
      fixed
      header={
        <Header height={60} sx={{ borderBottom: 0 }}>
          <Container className={classes.inner} fluid>
            <Group></Group>
            <Group spacing={5} className={classes.links}>
              {items}
            </Group>
            <Group>
              {account && <Badge>{minifyAddress(account)}</Badge>}
              {!account && (
                <Button compact onClick={() => connect()}>
                  Connect
                </Button>
              )}

              <ToggleTheme />
            </Group>
          </Container>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}

export default Layout;

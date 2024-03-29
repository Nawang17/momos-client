import { createStyles, Title, Text, Button, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import { Trans } from "@lingui/macro";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 50,
    paddingBottom: 50,
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    "@media (max-width: 520px)": {
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },
  },
}));

export function Hero({ darkmode }) {
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper} size={960}>
      <div className={classes.inner}>
        <Title className={classes.title}>
          <Trans>
            Welcome to
            <Text px={7} component="span" className={classes.highlight} inherit>
              momos
            </Text>
          </Trans>
        </Title>

        <Container p={0} size={600}>
          <Text
            color={darkmode ? "rgb(144, 146, 150)" : "#000000"}
            size="lg"
            className={classes.description}
          >
            <Trans>Connect with people around the world</Trans>
          </Text>
        </Container>

        <div className={classes.controls}>
          <Link className={classes.control} to={"/Login"}>
            <Button size="sm" variant="default" color="gray">
              <Trans>Login</Trans>
            </Button>
          </Link>
          <Link className={classes.control} to={"/Register"}>
            <Button size="sm">
              <Trans>Register</Trans>
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

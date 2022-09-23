import { createStyles, Title, Text, Button, Container } from "@mantine/core";

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

export function Hero() {
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper} size={960}>
      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome to{" "}
          <Text component="span" className={classes.highlight} inherit>
            Momos
          </Text>{" "}
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" className={classes.description}>
            Connect with people around the world.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="sm"
            variant="default"
            color="gray"
          >
            Login
          </Button>
          <Button className={classes.control} size="sm">
            Register
          </Button>
        </div>
      </div>
    </Container>
  );
}

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";

export function Register() {
  return (
    <div style={{ height: "80vh" }}>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome to momos!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account?{" "}
          <Anchor
            href="#"
            size="sm"
            onClick={(event) => event.preventDefault()}
          >
            Login
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Username" placeholder="Username" required />
          <PasswordInput
            label="Password"
            placeholder="Password"
            required
            mt="md"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            required
            mt="md"
          />

          <Button fullWidth mt="xl">
            Register
          </Button>
        </Paper>
      </Container>
    </div>
  );
}

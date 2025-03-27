import { login, signup } from './actions'
import { Container, Box, TextField, Button, Section, Flex, Grid } from '@radix-ui/themes'

export default function LoginPage() {
  return (
    <Section mt="10">
      <Container size="1">
        <Box>
          <form>
            <Grid
              columns="1"
              align="center"
              justify="center"
              gap="2"
            >
              <Box>
                <Box pb="2">
                  <label htmlFor="email">Email:</label>
                  <TextField.Root
                    tabIndex={1}
                    placeholder="Email"
                    id="email"
                    name="email"
                    type="email"
                    required
                  />
                </Box>
                <Box pb="4">
                  <label htmlFor="password">Password:</label>
                  <TextField.Root
                    tabIndex={2}
                    placeholder="Password"
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </Box>
                <Flex justify="end" gap="2">
                  <Button
                    tabIndex={4}
                    formAction={signup}
                  >
                    Sign up
                  </Button>
                  <Button
                    tabIndex={3}
                    formAction={login}
                  >
                    Log in
                  </Button>
                </Flex>
              </Box>


            </Grid>
          </form>
        </Box>
    </Container>
    </Section>
  )
}
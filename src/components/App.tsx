import React from 'react';
import {
  AppProvider,
  Checkbox,
  FormLayout,
  Frame,
  Page,
  Card,
  Layout,
  Button,
  Form,
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import {
  DeclarativeFormContext,
  renderNodes,
  SchemaNode,
  SchemaNodeDefinitionLegacy,
} from '@zeachco/declarative-forms/lib';
import V1 from '../schema.json';
import {translateError, translateLabel} from '../utilities/demo-utilities';
import {decorateForm} from '../utilities/decorate-form';

const context = new DeclarativeFormContext({
  decorate: decorateForm,
  translators: {
    label: translateLabel,
    sectionTitle: translateLabel,
    path: translateLabel,
    error: translateError,
  },
});

const {Provider} = context.ReactContext;

const schema: SchemaNodeDefinitionLegacy = {
  type: 'group',
  attributes: V1,
  // TODO: remove SchemaNodeDefinitionLegacy cast and implement alternative format options
} as SchemaNodeDefinitionLegacy;

const root = new SchemaNode(context, schema);

// for debugger
(window as any).root = root;

export function App() {
  const [debug, setDebug] = React.useState(context.debug);
  const [json, setJson] = React.useState<any>({});
  const [errors, setErrors] = React.useState<any>({});

  const formJsx = (
    <Layout.Section oneHalf>
      <Provider value={{errors}}>{renderNodes({root})}</Provider>
    </Layout.Section>
  );

  const formSubmitJsx = (
    <Layout.Section>
      <Card>
        <Card.Section>
          <Button primary submit>
            Submit
          </Button>
          <pre>{JSON.stringify(json, null, 1)}</pre>
        </Card.Section>
      </Card>
    </Layout.Section>
  );

  return (
    <AppProvider i18n={undefined as any}>
      <Frame
        topBar={
          <Layout>
            <Card>
              <Card.Section>
                <FormLayout>
                  <Checkbox
                    label="Debug structure"
                    checked={debug}
                    onChange={handleSwitch}
                  />
                </FormLayout>
              </Card.Section>
            </Card>
          </Layout>
        }
      >
        <Page title="Demo">
          <Form onSubmit={handleSubmit} autoComplete={false}>
            <Layout>
              {formJsx}
              {formSubmitJsx}
            </Layout>
          </Form>
        </Page>
      </Frame>
    </AppProvider>
  );

  function handleSwitch(checked: boolean) {
    context.debug = checked;
    setDebug(checked);
  }

  function handleSubmit() {
    const data = root.data();
    console.log(data);
    setJson(data);

    setErrors({
      legalEntity: {
        businessDetails: {
          address: ['Something wrong'],
        },
      },
    });

    // we could even have validation from multiple
    // sources and just merge the errors
    setTimeout(() => {
      setErrors({
        ...errors,
        legalEntity: {
          businessDetails: {
            address: ['Something wrong delayed'],
          },
        },
      });
    }, 1000);
  }
}

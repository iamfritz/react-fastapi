import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  TextInput,
  Edit,
  Create,
  SimpleForm,
  EditButton,
  DeleteButton,
  required,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  DateField,
  usePermissions,
} from "react-admin";
import { authProvider } from "./authProvider";
import { dataProvider } from "./dataProvider";

const statusChoices = [
  { id: "draft", name: "Draft" },
  { id: "published", name: "Published" },
];

const productFilters = [
  <TextInput key="q" label="Search" source="q" alwaysOn />,
  <TextInput key="slug" label="Slug" source="slug" />,
  <SelectInput key="status" source="status" choices={statusChoices} />,
];

const blogFilters = [
  <TextInput key="q" label="Search" source="q" alwaysOn />,
  <TextInput key="slug" label="Slug" source="slug" />,
  <SelectInput key="status" source="status" choices={statusChoices} />,
];

function AdminDeleteButton() {
  const { permissions } = usePermissions();
  return permissions === "admin" ? <DeleteButton /> : null;
}

const ProductList = () => (
  <List filters={productFilters}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <TextField source="sku" />
      <NumberField
        source="price"
        options={{ style: "currency", currency: "USD" }}
      />
      <ReferenceField source="category_id" reference="categories" link={false}>
        <TextField source="name" />
      </ReferenceField>
      <TextField source="status" />
      <EditButton />
      <AdminDeleteButton />
    </Datagrid>
  </List>
);

const ProductEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="slug" validate={[required()]} />
      <TextInput source="sku" validate={[required()]} />
      <NumberInput source="price" min={0} validate={[required()]} />
      <TextInput source="description" multiline minRows={4} />
      <TextInput source="image" />
      <ReferenceInput source="category_id" reference="categories">
        <SelectInput optionText="name" emptyText="No category" />
      </ReferenceInput>
      <SelectInput source="status" choices={statusChoices} defaultValue="draft" />
    </SimpleForm>
  </Edit>
);

const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="slug" validate={[required()]} />
      <TextInput source="sku" validate={[required()]} />
      <NumberInput source="price" min={0} validate={[required()]} />
      <TextInput source="description" multiline minRows={4} />
      <TextInput source="image" />
      <ReferenceInput source="category_id" reference="categories">
        <SelectInput optionText="name" emptyText="No category" />
      </ReferenceInput>
      <SelectInput source="status" choices={statusChoices} defaultValue="draft" />
    </SimpleForm>
  </Create>
);

const BlogList = () => (
  <List filters={blogFilters}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <TextField source="status" />
      <DateField source="created_at" showTime />
      <EditButton />
      <AdminDeleteButton />
    </Datagrid>
  </List>
);

const BlogEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="slug" validate={[required()]} />
      <TextInput source="excerpt" multiline minRows={2} />
      <TextInput
        source="content"
        multiline
        minRows={8}
        validate={[required()]}
      />
      <TextInput source="photo" />
      <SelectInput source="status" choices={statusChoices} defaultValue="draft" />
      <ReferenceInput source="category_id" reference="categories">
        <SelectInput optionText="name" emptyText="No category" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

const BlogCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="slug" validate={[required()]} />
      <TextInput source="excerpt" multiline minRows={2} />
      <TextInput
        source="content"
        multiline
        minRows={8}
        validate={[required()]}
      />
      <TextInput source="photo" />
      <SelectInput source="status" choices={statusChoices} defaultValue="draft" />
      <ReferenceInput source="category_id" reference="categories">
        <SelectInput optionText="name" emptyText="No category" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export function AdminApp() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      basename="/admin"
      title="Store Admin"
    >
      <Resource
        name="products"
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
        recordRepresentation="title"
      />
      <Resource
        name="posts"
        list={BlogList}
        edit={BlogEdit}
        create={BlogCreate}
        recordRepresentation="title"
      />
      <Resource name="categories" />
    </Admin>
  );
}

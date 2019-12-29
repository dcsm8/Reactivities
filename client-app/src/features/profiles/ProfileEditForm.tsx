import React, { useContext } from "react";
import { combineValidators, isRequired } from "revalidate";
import { Form as FinalForm, Field } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { Button, Form } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { IProfileFormValues } from "../../app/models/profile";

const validate = combineValidators({
  displayName: isRequired("Name"),
  bio: isRequired("Bio"),
});

const ProfileEditForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { editProfile, profile } = rootStore.profileStore;
  return (
    <FinalForm
      onSubmit={(values: IProfileFormValues) =>
        editProfile(values).catch(error => ({ [FORM_ERROR]: error }))
      }
      validate={validate}
      initialValues={profile!}
      render={({
        handleSubmit,
        submitting,
        invalid,
        pristine,
        submitError,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            name="displayName"
            component={TextInput}
            placeholder="Name"
            value={profile!.bio}
          />
          <Field
            name="bio"
            component={TextAreaInput}
            placeholder="Bio"
            rows={5}
            value={profile!.displayName}
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            positive
            content="Update profile"
            floated="right"
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);

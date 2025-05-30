/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react';

import * as React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { EntityTextArea } from '../EntityTextArea';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { CatalogProcessorResult } from '../../types';
import { parseEntityYaml } from '../../utils';
import { EntityValidationOutput } from '../EntityValidationOutput';

const EXAMPLE_CATALOG_INFO_YAML = `# Provide your entity descriptor YAML to validate its structure
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: test
  description: Component description
  links: []
  tags: []
  annotations: {}
spec:
  type: service
  lifecycle: experimental
  owner: owner
`;

export const EntityValidationContent = (props: {
  defaultYaml?: string;
  defaultLocation?: string;
  hideFileLocationField?: boolean;
  contentHead?: React.ReactNode;
}) => {
  const {
    defaultYaml = EXAMPLE_CATALOG_INFO_YAML,
    defaultLocation = 'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    hideFileLocationField = false,
    contentHead,
  } = props;

  const [catalogYaml, setCatalogYaml] = useState(defaultYaml);
  const [yamlFiles, setYamlFiles] = useState<CatalogProcessorResult[]>();
  const [locationUrl, setLocationUrl] = useState(defaultLocation);

  const parseYaml = () => {
    const parsedFiles = [
      ...parseEntityYaml(Buffer.from(catalogYaml), {
        type: 'url',
        target: locationUrl ? locationUrl : 'http://localhost',
      }),
    ];
    setYamlFiles(parsedFiles);
  };

  return (
    <Grid
      container
      direction="column"
      style={{ height: '100%' }}
      wrap="nowrap"
      data-testid="main-grid"
    >
      {contentHead}

      {!hideFileLocationField && (
        <TextField
          fullWidth
          label="File Location"
          margin="normal"
          variant="outlined"
          required
          value={locationUrl}
          placeholder={defaultLocation}
          helperText="Present or future location of your entity descriptor YAML file. This is not the file being validated; this merely adds location annotations to the entity descriptor file being validated."
          onChange={e => setLocationUrl(e.target.value)}
        />
      )}

      <Grid container direction="row" style={{ height: '100%' }}>
        <Grid item md={6} xs={12}>
          <Grid
            container
            direction="column"
            alignItems="flex-end"
            style={{ height: '100%' }}
            wrap="nowrap"
          >
            <Grid item style={{ width: '100%', flex: '1 1 auto' }}>
              <EntityTextArea
                onValidate={parseYaml}
                onChange={(value: string) => setCatalogYaml(value)}
                catalogYaml={catalogYaml}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={parseYaml}>
                Validate
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <EntityValidationOutput
                processorResults={yamlFiles}
                locationUrl={locationUrl}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const EntityValidationPage = (props: {
  defaultYaml?: string;
  defaultLocation?: string;
  hideFileLocationField?: boolean;
  contentHead?: React.ReactNode;
}) => {
  const {
    defaultYaml = EXAMPLE_CATALOG_INFO_YAML,
    defaultLocation = 'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    hideFileLocationField = false,
    contentHead,
  } = props;

  return (
    <Page themeId="tool">
      <Header
        title="Entity Validator"
        subtitle="Validate Backstage catalog entity descriptor YAML files"
      />
      <Content>
        <EntityValidationContent
          defaultYaml={defaultYaml}
          defaultLocation={defaultLocation}
          hideFileLocationField={hideFileLocationField}
          contentHead={contentHead}
        />
      </Content>
    </Page>
  );
};

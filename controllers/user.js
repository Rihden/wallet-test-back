const User = require("../models/user");
const UrlModel = require("../models/url");
const createCard = require("../createBusinessCard");
const path = require("path");

const addUser = async (req, res) => {
  const userData = req.body;
  try {
    const result = await User.create(userData);
    if (result) {
      await createCard(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.company,
        userData.companyWebsite,
        userData.phone,
        result._id
      );
      const file = path.resolve(__dirname, "..", result._id + ".pdf");
      res.download(file);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

const createPass = async (req, res) => {
  const userData = req.body;
  const { GoogleAuth } = require("google-auth-library");
  const jwt = require("jsonwebtoken");

  // TODO: Define Issuer ID
  const issuerId = "3388000000022249949";

  // TODO: Define Class ID
  const classId = `${issuerId}.codelab_class`;

  const baseUrl = "https://walletobjects.googleapis.com/walletobjects/v1";

  const credentials = {
    type: "service_account",
    project_id: "noble-serenity-390303",
    private_key_id: "0eafc70abac527ad6c94b3ee69c9944cb594e8b9",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDYr6/gU0t/ka36\nN6ZGrZYDExlrcn/4CEhtcz8wGY1ncX7YotT0OeUzNza3cpFhlbs82FE25Sn8XcI5\niChY3KPoY44rCB5/FDk+XokWqleAZ9bE9cDtz3D/sjZ3Z7KpO2X+CnObHcpeHHCI\no/WgAzCYNzBIzsZ0LhivM+TcNbwelueJrG2OQqrsimfVdBE1vY+R3TfcwKWXmCHQ\nMakR+UcZmse0tD5GYieQGDvI/hOabsixpPUIjOiEEHEkUIA7LayBTLy7oMGYwI3V\nncQ43NBPakAkYwXtPQQfydNM+b+7NWeJVgzKFcxiqY2lhVjH36+DglBcXAzmR2y9\nXT7g9LnVAgMBAAECggEAAQ2VhrsQ5l1QYaNsmPJWBMzOdlG3on5zz6hcOcEeCU8p\nZSchbtBrNz0A9JJHd5hxMQICHwitFA9mlr39KDVmTIZTVg0zjL2N66os82G/jB21\nEv74wY8dBvkYP6tO2Hiz7bCiUDIsXhm4SEm3s1/gmBTIlMoAd+cTcqKHbbSLJgDm\ncxfZqkOgaEQ3SfooTXvkXFXkMFQtqMs8j64wLXoKYutizRrWgL0oWeDSb8WRvP7O\netG/6uwEcBHCQlYB2efhzutOS4ok3FaoZntzi9PxlK5Ct45o3PForweA9hCAt8kW\nWcXZOHlP+jV53GDfcEaZu1nwh4vjJKiVJBS2hxAkgQKBgQD52Oaorzof/Ua+E3IM\nlAeAf5JaQF9U1PrFMVdI5oFHJMjKob8rASjxcybXK5gJWVhlfoCysOvBmowEEzNI\nzMBqRzpYKo8AM1l7e7D1ZnOOf4vl3XfmRVaYlqZK1xZpmQ+wkqtuUX3eDgR04D3K\ngq9l/X85IHCL1NPwRClR9ahOQQKBgQDeBbscyrRpQyixPQcEhJ54/GNcbd5Pk62N\nt5G/r4Nc0tfW5wpJ3WiPtFBi7pMLAY3EWr5kXU7g6im89y3x+bFoKeee9suBgrmq\n9F4dxMFX0MzAgLAcjyqjcnuNoVIHiMjFJFI1uN5MwZfHTiJT4K+toZqyX1pFjXOl\nvG9RKw+ulQKBgCkQ8bjANHmVk88iOxi+LA1+6ntTIVg8OYu39HTTDmS3Mxm7RES5\nSBWHq9aqH69JtDHafSTh155W3LS+wyswHGBbnMdpF2AdEJQvXIK5eDzv0frSUCbV\nNsqV2Hdsqw5oTh/ju7HCS0H4Y9siEIX8vP+yjvrAzj7tmHhhe7kw+50BAoGAS1Ky\nalAy6MtKEOddbCD6Cp3Fr+PuWh0F8mBm6BtJe8JkS5pSmUCuaqKH6yh5ZnB+gjEv\nCqnFSvTmeB97zO4jS+17kSi1XhjVmLQTAhJwbbR+4ohGN0oy8wSx+hjS1Y+IXam2\n4lb3xB6huZI+fyppL4T2ELHc1F/q7j2Bno33YgkCgYA8hRIVGSwjv6feKANBoVjU\ntLbv/OkPKVozuL00WUwGo7dW4PSXGMBtiMpXgDXMRyoBMZkMmRGFAk764gKAgAgx\ndx3+W7+5OlRruH4jI7ikBrlHPkGD3KUl0sYbDMfcb7aePUggJEciM5+EX3SGPaYt\nhjB+BB750i361IQUfcdvhw==\n-----END PRIVATE KEY-----\n",
    client_email: "whatevername@noble-serenity-390303.iam.gserviceaccount.com",
    client_id: "115213224899998986229",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/whatevername%40noble-serenity-390303.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };

  const httpClient = new GoogleAuth({
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
  });

  async function createPassClass(req, res) {
    // TODO: Create a Generic pass class
    // TODO: Create a Generic pass class
    let genericClass = {
      id: `${classId}`,
      classTemplateInfo: {
        cardTemplateOverride: {
          cardRowTemplateInfos: [
            {
              twoItems: {
                startItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: 'object.textModulesData["points"]',
                      },
                    ],
                  },
                },
                endItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: 'object.textModulesData["contacts"]',
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        detailsTemplateOverride: {
          detailsItemInfos: [
            {
              item: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'class.imageModulesData["event_banner"]',
                    },
                  ],
                },
              },
            },
            {
              item: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'class.textModulesData["game_overview"]',
                    },
                  ],
                },
              },
            },
            {
              item: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'class.linksModuleData.uris["official_site"]',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      imageModulesData: [
        {
          mainImage: {
            sourceUri: {
              uri: "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/google-io-2021-card.png",
            },
            contentDescription: {
              defaultValue: {
                language: "en-US",
                value: "Google I/O 2022 Banner",
              },
            },
          },
          id: "event_banner",
        },
      ],
      textModulesData: [
        {
          header: "Gather points meeting new people at Google I/O",
          body: "Join the game and accumulate points in this badge by meeting other attendees in the event.",
          id: "game_overview",
        },
      ],
      linksModuleData: {
        uris: [
          {
            uri: "https://io.google/2022/",
            description: "Official I/O '22 Site",
            id: "official_site",
          },
        ],
      },
    };

    let response;
    try {
      // Check if the class exists already
      response = await httpClient.request({
        url: `${baseUrl}/genericClass/${classId}`,
        method: "GET",
      });

      console.log("Class already exists");
      console.log(response);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Class does not exist
        // Create it now
        response = await httpClient.request({
          url: `${baseUrl}/genericClass`,
          method: "POST",
          data: genericClass,
        });

        console.log("Class insert response");
        console.log(response);
      } else {
        // Something else went wrong
        console.log(err);
        res.send("Something went wrong...check the console logs!");
      }
    }
  }

  async function createPassObject(req, res) {
    // TODO: Create a new Generic pass for the user
    // TODO: Create a new Generic pass for the user
    let objectSuffix = `${req.body.email.replace(/[^\w.-]/g, "_")}`;
    let objectId = `${issuerId}.${objectSuffix}`;

    let genericObject = {
      id: `${objectId}`,
      classId: classId,
      genericType: "GENERIC_TYPE_UNSPECIFIED",
      hexBackgroundColor: "#4285f4",
      logo: {
        sourceUri: {
          uri: "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg",
        },
      },
      cardTitle: {
        defaultValue: {
          language: "en",
          value: `${req.body.email}`,
        },
      },
      subheader: {
        defaultValue: {
          language: "en",
          value: `${req.body.company}`,
        },
      },
      header: {
        defaultValue: {
          language: "en",
          value: `${req.body.firstName} ${req.body.lastName}`,
        },
      },
      barcode: {
        type: "QR_CODE",
        value: `${objectId}`,
      },
      heroImage: {
        sourceUri: {
          uri: "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/google-io-hero-demo-only.jpg",
        },
      },
      textModulesData: [
        {
          header: "POINTS",
          body: "1234",
          id: "points",
        },
        {
          header: "CONTACTS",
          body: "20",
          id: "contacts",
        },
      ],
    };

    // TODO: Create the signed JWT and link
    const claims = {
      iss: credentials.client_email,
      aud: "google",
      origins: [],
      typ: "savetowallet",
      payload: {
        genericObjects: [genericObject],
      },
    };

    const token = jwt.sign(claims, credentials.private_key, {
      algorithm: "RS256",
    });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    const result = await UrlModel.create({ passUrl: saveUrl });
    console.log(result);
    res.send(result._id);
  }
  await createPassClass(req, res);
  await createPassObject(req, res);
};

module.exports = {
  addUser,
  createPass,
};

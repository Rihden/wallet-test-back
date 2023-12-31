const User = require("../models/user");
const UrlModel = require("../models/url");
const createCard = require("../createBusinessCard");
const path = require("path");

const addUser = async (req, res) => {
  const userData = req.body;
  try {
    const result = await User.create(userData);
    if (result) {
      const pdfBytes = await createCard(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.company,
        userData.companyWebsite,
        userData.phone,
        result._id
      );

      res.send(pdfBytes);
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

  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

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
              uri: "https://images.unsplash.com/uploads/1413387158190559d80f7/6108b580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&h=336",
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
          uri: "https://images.unsplash.com/uploads/1413387158190559d80f7/6108b580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&h=336",
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
    res.send({ passUrl: saveUrl, QRUrl: result._id });
  }
  await createPassClass(req, res);
  await createPassObject(req, res);
};

module.exports = {
  addUser,
  createPass,
};

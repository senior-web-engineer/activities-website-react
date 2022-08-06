import { appDomain, sendInBlueAPI } from '../../config';

export const sendPOST = async (url, headers, data, method = 'POST') => {
  let response = await fetch(`${url}`, {
    method: method,
    headers: new Headers(headers),
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw Error(response)
  } else {
    response = response.json()
    // console.log(response);
    return response
  }
}

export const sendGET = async (url, headers) => {
  let response = await fetch(`${url}`, {
    method: 'GET',
    headers: new Headers(headers),
  })
  if (!response.ok) {
    throw Error(response)
  } else {
    response = response.json()
    // console.log(response);
    return response
  }
}

export const sendEmailSIB = ({
  to = [],
  replyTo = 'support@activities.app',
  subject = 'Activies App',
  htmlContent = `Here is <a href='${appDomain}'>Activies App.</a>`,
  attaches = [],
  textContent = `Here is Activies App.`,
  onFinish = console.log,
  onError = console.log,
}) => {
  sendPOST(
    `${sendInBlueAPI.baseUrl}/smtp/email`,
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': sendInBlueAPI.emailAPIKey,
    },
    {
      sender: {
        name: 'Activies App',
        email: 'support@activities.app',
      },
      to: to,
      replyTo: { email: replyTo || 'support@activities.app' },
      subject: subject,
      textContent: textContent || 'Visit Us!',
      htmlContent: htmlContent,
      // attachment: (attaches ?? []).map((attach) => ({
      //   name: attach?.id ?? '',
      //   content: attach?.data ?? '',
      // })),
    },
  )
    .then((res) => {
      onFinish(res)
    })
    .catch((err) => {
      onError(err)
    })
}

export const getSIBContact = (onFinish = console.log) => {
  sendGET(`${sendInBlueAPI.baseUrl}/contacts/lists/5/contacts`, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'api-key': sendInBlueAPI.emailAPIKey,
  })
    .then((res) => {
      onFinish(res)
    })
    .catch((err) => {
      onFinish(err)
    })
}

export const addSIBContact = (userData = {}, onFinish = console.log) => {
  sendPOST(
    `${sendInBlueAPI.baseUrl}/contacts`,
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': sendInBlueAPI.emailAPIKey,
    },
    {
      email: userData?.email ?? '',
      attributes: {
        FNAME: String(userData?.name ?? '').split(' ')?.[0],
        LNAME: String(userData?.name ?? '').split(' ')?.[1],
      },
      listIds: [5], // activities app users list in send in blue : 5
    },
  )
    .then((res) => {
      onFinish(res)
    })
    .catch((err) => {
      onFinish(err)
    })
}

export const updateSIBContact = (
  contactData = {},
  updateData = {},
  onFinish = console.log,
) => {
  sendPOST(
    `${sendInBlueAPI.baseUrl}/contacts/${contactData?.id}`,
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': sendInBlueAPI.emailAPIKey,
    },
    {
      ...updateData,
    },
    'PUT',
  )
    .then((res) => {
      onFinish(res)
    })
    .catch((err) => {
      onFinish(err)
    })
}

export const deleteSIBContact = (contactData = {}, onFinish = console.log) => {
  sendPOST(
    `${sendInBlueAPI.baseUrl}/contacts/${contactData?.id}`,
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': sendInBlueAPI.emailAPIKey,
    },
    {},
    'DELETE',
  )
    .then((res) => {
      onFinish(res)
    })
    .catch((err) => {
      onFinish(err)
    })
}

export const getSIBCampaign = (onFinish = console.log) => {
  sendGET(`${sendInBlueAPI.baseUrl}/emailCampaigns`, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'api-key': sendInBlueAPI.emailAPIKey,
  })
    .then((res) => {
      onFinish(res)
    })
    .catch((err) => {
      onFinish(err)
    })
}

export const createEmailCampaign = (data = {}, onFinish = console.log) => {
  sendPOST(
    `${sendInBlueAPI.baseUrl}/emailCampaigns`,
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': sendInBlueAPI.emailAPIKey,
    },
    {
      sender: {
        name: 'Activities App',
        email: 'jwquaid@gotalkusa.com',
      },
      name: data?.subject || 'Email Campaign from Activity',
      subject: data?.subject || 'Email Campaign from Activity',
      htmlContent: data?.htmlContent || 'Email Campaign from Activity',
      recipients: { listIds: [5], exclusionListIds: [2, 4] },
    },
  )
    .then((res) => onFinish(res))
    .catch((res) => onFinish(res))
}

export const sendNowEmailCampaign = (
  campaignId = 0,
  onFinish = console.log,
) => {
  sendPOST(
    `${sendInBlueAPI.baseUrl}/emailCampaigns/${campaignId}/sendNow`,
    {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': sendInBlueAPI.emailAPIKey,
    },
    {},
  )
    .then((res) => onFinish(res))
    .catch((res) => onFinish(res))
}

export const sendNewProviderEmail = (email = '', name = '') => {
  sendEmailSIB({
    to: [{ email: 'jwquaid@activities.app', name: 'James' }],
    // to: [{ email: 'luckyman0816@gmail.com', name: 'James' }],
    subject: 'Activities App: New Provider',
    htmlContent: `
      <h1>Activies App - New Provider</h1>
      <p>
        Hi James, This is Activities App.
      </p>
      <p>
        A New Provider is registered.
      </p>
      <h3>email: ${email}<h3>
      <h3>name: ${name}<h3>
      <p>
        <a href="https://d2qkgxa95zeei2.cloudfront.net/advertiser-list.php?pg=advertiser&spg=advertiserlist">Check it now</a>
      </p>
    `,
  })
}

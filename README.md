# **SocioBerries** - Social Media for Businesses and Creators on the Aptos Blockchain

### **Overview**

**SocioBerries** is a decentralized social media platform built on the **Aptos Blockchain**, where businesses and creators collaborate through promotional content. Creators earn **social credit values** based on engagement metrics from their followers, which is used to unlock opportunities to promote businesses. Once they meet the required social credit, creators can either receive monetary rewards or actual goods like clothes, hotel stays, and more in return for promoting the business.

We leverage **Linear Regression** to calculate the quality and impact of the content posted by influencers, considering the value of user engagement and follower activity. Users are valued based on their selective engagement in certain niches and their spending patterns on the platform, such as buying goods from ads or paying for exclusive content.

### **Features**

- **Blockchain-based Social Credit**: 
   - Each creator's social credit is calculated using **AI**, which factors in engagement metrics, follower quality, and the overall interaction within the platform.
   - **On-chain actions** such as follows, likes, and comments are tracked and indexed to accurately reflect the creator’s influence.

- **Business-Creator Collaboration**:
   - Businesses set requirements for the minimum social credit level needed for promotional collaborations.
   - Creators who meet the social credit requirement can promote the business and receive rewards in the form of goods or monetary compensation.

- **User Valuation & Selective Engagement**:
   - The value of a user is determined by how selectively they engage with content niches and their spending behavior on the platform.
   - Higher-value users increase the social credit of the creators they engage with, creating a more dynamic influencer evaluation system.

- **Keyless Onboarding with Google**:
   - Users sign up and log in seamlessly using **Sign in with Google**, which automatically generates a crypto wallet behind the scenes.

- **AI-Powered Content Quality Assessment**:
   - The quality of the promotional content posted by influencers is evaluated using **Linear Regression Algorithm**, ensuring that businesses receive valuable and impactful promotion.

### **Technical Stack**

- **Blockchain**: 
   - The platform is built on the **Aptos Blockchain**, which ensures decentralized data storage, transparency, and trust in every interaction.

- **Aptos Indexer**:
   - We utilize the **Aptos Indexer** to index all on-chain data, including engagement metrics (likes, comments, follows, etc.) to display on the frontend and to feed **Galadriel AI** for accurate social credit calculation.

- **AI Integration**:
   - **AI implementing Linear Regression** calculates the social credit score for each influencer by analyzing both on-chain engagement data and the quality of the influencer's audience.

- **Keyless Wallet Generation**:
   - Users are onboarded without needing to understand cryptocurrency wallets or private keys. Upon signing in with Google, a crypto wallet is automatically generated for each user, enabling seamless interaction with the blockchain.

### **Getting Started**

To get started with the project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gabrielantonyxaviour/aptos-hack.git
```

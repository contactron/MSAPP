# Material Selection Application Proof of Concept

## Project Description

This project began as a professional development exercise to improve the Front End development skills I learned through Udacity's Front End NanoDegree. I took the opportunity too to explore AngularJS as a means for integrating the material data into the application. 

The app is intended to help customers evaluate Brady materials (and products) to validate that it will meet their specific needs. 

## Running Instructions

The fully-functional application can be found here:
https://contactron.github.io/MSAPP/

## Functionality

On launch the application will load and display a list of the Brady Materials available to the application. Along with the Material list, several filters and a search tool are presented to allow the user to refine the list of materials.

**Filtering:**
The application allows users to search for, filter and otherwise find Brady materials (B#s) by a variety of different material attributes such as:
- Product Type (Label, Self-Lam, Sleeve or Tag)
- Application Use
- Special material properties
- Regulatory approvals, 
etc. 

The filtering logic and UI largely follow the presentation of product listing pages of Bradyid.com. Users can apply multiple filters which then appear in the filter stage. Users can remove individual filters and reset all filter if needed. Each filter section can be expanded or collapsed. 

There are some differences in how the filters work compared to Bradyid. These include:
1. The filters are initially presented as all collapsed.
2. The logic for refining results is an "AND" function for filter values across different filters. So, selecting a finish of "glossy" and a color of "red" shows only materials that are BOTH glossy AND red. This is the same for both the app and Bradyid. Different, however, is the logic for multiple filter values applied within one filter. The app again uses an "AND" function whereas Bradyid uses an "OR" function. So, if color "red" and color "yellow" are selected, the results in the app are all materials that are available in BOTH red AND yellow. On Bradyid the results would include any materials that are available in red OR yellow OR both. 
3. When a filter value is no longer available based on the current product set, the app will continue to show the value as a disable option. Bradyid, however, will remove the option and even the entire filter if no values are currently available. 

**Search:**
The search tool looks across all the available data for each material (name, description, special properties, finsih, etc.) and narrows the results to matches on the keywords entered. You can enter and apply any number of keywords.

**Display of material information**
The list of materials displayed in the app shows the material number and name. The user can click on any material and it will expand to show some key material characteristics. This includes:
- Material type (Label, Sleeve, etc.)
- Material description
- Material construction details (Finish, Base Material, Adhesive, etc.)
- Applications for use
- Available colors
- Regulatory approvals and other certifications (ROHS, UL, etc.)
- Chemical resistance details
- Adhesion details
- Link to the corresponding technical data sheet for the material

As the characteristics differs for each material type, the different sections dynamically adjust to display the appropriate information. For example, adhesion is not appropriate for a heat shrink sleeve. In this case the section changes to show more appropriate messaging. Likewise, as data is not available for all sections of all materials, the app dynamically adjust to hide or show sections if there is nothing to display. 

## Future Enhancements

There are many planned improvements that are not yet realized. These include:
- Adding additional material properties like minimum service temperature
- Providing links to products made from the materials
- Providing the ability to easily compare several materials side by side

## Acknowledgements

I leveraged the work of many others as I in the building of the application. 
- Classes and markup for the filtering section are borrowed from or closely follow code from BradyID website. 
- Countless submissions from the Stack Overflow community provided guidance 
- Also, many thanks to Jason Dudley from the BradyID dev team who provided some early guidance and encouragement on code structure and Angular setup. 


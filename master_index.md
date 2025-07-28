**Version:** 1.0
**Date:** [Current Date]
**Status:** Active

**1. Introduction: How to Use This Index**

This Master Index serves as the single source of truth for the
project's documentation. Its purpose is to define the role, status, and
audience for each key document, preventing confusion and ensuring
efficient workflow. Before starting any work, consult this index to find
the correct document for your task. The documents are categorized by
their function in the project lifecycle: **Strategic
Vision**, **Implementation Blueprints**, **Design Language**,
and **Archived Sources**.

**2. Core Strategic Documents (The "Why & What")**

These documents define the project's vision, goals, and high-level
roadmap. They are the primary reference for strategic alignment and
understanding the business context.

  ---------------------------------------------------------------------------------
  **Document      **Filename**        **Purpose &       **Status**   **Primary
  Name**                              Role**                         Audience**
  --------------- ------------------- ----------------- ------------ --------------
  **Product       PRDv1.md            The **Product     **Active &   Leadership,
  Requirements                        Constitution**.   Guiding**    Product,
  Document                            Defines the                    Design,
  (PRD)**                             vision, problem                Engineering
                                      statement, target              (for context)
                                      audience, success              
                                      metrics, and                   
                                      phased feature                 
                                      rollout (MVP,                  
                                      Phase 2, Phase                 
                                      3). Answers the                
                                      "Why are we                   
                                      building this?"               
                                      and "What are we              
                                      building at a                  
                                      high level?".                 

  **Technical     Technical           The **System      **Active &   Lead
  Architecture    Architecturev1.md   Blueprint**.      Guiding**    Engineering,
  Document**                          Outlines the                   DevOps, AI
                                      high-level                     Assistant (for
                                      architecture (C4               setup)
                                      diagrams),                     
                                      technology stack,              
                                      architectural                  
                                      patterns                       
                                      (serverless                    
                                      monolith), and                 
                                      core                           
                                      infrastructure                 
                                      choices. Answers               
                                      the "How will                 
                                      the system be                  
                                      structured?".                 
  ---------------------------------------------------------------------------------

**3. Detailed Implementation Blueprints (The "How")**

These documents provide the granular, actionable details required for
development. They are the **master prompts for the AI coding
assistant** and the primary reference for the engineering team.

  -------------------------------------------------------------------------------------
  **Document Name** **Filename**   **Purpose & Role**     **Status**     **Primary
                                                                         Audience**
  ----------------- -------------- ---------------------- -------------- --------------
  **Comprehensive   specs.md       The **Master Feature   **Active &     Engineering,
  Feature                          Bible**. Provides an   Executable**   QA, AI
  Specification**                  exhaustive,                           Assistant
                                   line-by-line                          
                                   specification                         
                                   for *every* feature,                  
                                   including database                    
                                   schemas, API                          
                                   endpoints, and                        
                                   detailed                              
                                   implementation logic.                 
                                   It is the most                        
                                   granular "how-to"                   
                                   for building the                      
                                   application's                        
                                   functionality.                        

  -------------------------------------------------------------------------------------

**4. Design Language & Visual Assets (The "Look & Feel")**

These documents define the visual and interactive identity of the
application. They are the primary source for all frontend and UI
development.

  --------------------------------------------------------------------------------------
  **Document      **Filename**    **Purpose & Role**       **Status**     **Primary
  Name**                                                                  Audience**
  --------------- --------------- ------------------------ -------------- --------------
  **UI/UX Design  designv2.md     The **Design             **Active &     Frontend
  Specification &                 Constitution**. A        Executable**   Engineering,
  Style Guide**                   comprehensive guide to                  UI/UX Design,
                                  the entire design                       AI Assistant,
                                  system, including brand                 QA
                                  personality, color                      
                                  palettes, typography,                   
                                  components, states, and                 
                                  page layouts. It                        
                                  translates the brand                    
                                  identity into a complete                
                                  visual language.                        

  **System Color  index_hsl.css   A foundational **Theming **Active &     Frontend
  & Theme                         Asset**. Provides the    Referenced**   Engineering,
  Variables**                     low-level CSS custom                    AI Assistant
                                  properties for                          
                                  the *non-brand* system                  
                                  colors (semantic,                       
                                  neutral, etc.) for both                 
                                  light and dark modes. It                
                                  is a dependency                         
                                  referenced                              
                                  by designv2.md.                         

**System Features** featuresv3.md  A detailed list of the app 's features   **Active & Referenced** Frontend Engineering, AI Assistant
                                           

  --------------------------------------------------------------------------------------



This master index provides a clear and actionable path for navigating
the project's documentation, ensuring that all team members and AI
assistants are building from the same, correct set of plans.

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, NavLink } from 'react-router-dom'
import Header from '../layout/header'
import { Footer } from '../layout/footer'
import { getCategories } from '../../Store/action/categories'
import { Category } from '../content/element/widget'
import { getBannerImage } from '../../Store/action/categories'
import { getPressList } from '../../Store/action/blogActions'
import pressImg from '../../assets/img/press.jpg'
import moment from 'moment'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

export default function PressAll(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const [value, setValue] = React.useState(null)
  const logo = useSelector((state) => state.logo)
  const [years, setYears] = useState([])
  const [selCategoryid, setSelCategoryid] = useState('')
  const [pressDataYear, setPressDataYear] = useState(null)
  const categoryList = useSelector((state) => state.category.categories)
  const pressData = useSelector((state) => state.blog.press_data)
  const [load, setLoad] = useState(true)
  const heroImage = useSelector((state) => state.category.hero_image)

  useEffect(() => {
    setLoad(false)
  }, [heroImage])

  useEffect(() => {
    let years = []
    dispatch(getCategories())
    dispatch(getBannerImage('/press-all'))
    dispatch(getPressList())
    for (let i = 0; i < 6; i++) {
      const year = moment().subtract(i, 'years').format('YYYY')
      years.push(year)
    }
    const id = props?.location?.state?.categroy_id ?? ''
    setSelCategoryid(id)
    setYears(years)
    setValue(years[0])
  }, [dispatch, props])

  useEffect(() => {
    const checkyear = years.filter((item) => item === value)
    if (checkyear.length > 0 && pressData && pressData.length > 0) {
      if (selCategoryid !== '') {
        const data = pressData.filter(
          (item) =>
            moment(item.timestamp.seconds * 1000).format('YYYY') ===
              checkyear[0] && item.category_id === selCategoryid,
        )
        setPressDataYear(data)
      } else {
        const data = pressData.filter(
          (item) =>
            moment(item.timestamp.seconds * 1000).format('YYYY') ===
            checkyear[0],
        )
        setPressDataYear(data)
      }
    }
  }, [pressData, value, years, selCategoryid])

  return (
    <>
      <section className="header-breadcrumb bgimage press-session list-overlay">
        {!load && (
          <div
            className="bg_image_holder"
            style={{
              backgroundImage: `url(${heroImage || pressImg})`,
              opacity: '1',
            }}
          ></div>
        )}
        <div className="mainmenu-wrapper">
          <Header logo={logo[0].light} class="menu--light" history={history} />
        </div>
        {/* <!-- ends: .mainmenu-wrapper --> */}
        <div className="breadcrumb-wrapper content_above text-center">
          <h1 className="page-title press-title">Press Releases</h1>
        </div>
      </section>
      <section className="blog-area section-padding-strict border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="atbd_content_module atbd_listing_details cu-radius">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-file-text-o"></span>
                      {'Press Releases'}
                    </h4>
                    <div className="press-header">
                      <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-age-native-simple">
                          Select Year
                        </InputLabel>
                        <Select
                          native
                          value={value || ''}
                          onChange={(e) => setValue(e.target.value)}
                          label="Select Year"
                          inputProps={{
                            name: 'age',
                            id: 'outlined-age-native-simple',
                          }}
                        >
                          {years.length > 0 &&
                            years.map((item, key) => {
                              return (
                                <option value={item} key={key}>
                                  {item}
                                </option>
                              )
                            })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                {pressDataYear && (
                  <div className="atbdb_content_module_contents">
                    {pressDataYear.length > 0 ? (
                      pressDataYear.map((item, key) => {
                        return (
                          <div className="press-news-section" key={key}>
                            <p>
                              {moment(item.timestamp.seconds * 1000).format(
                                'LL',
                              )}
                            </p>
                            <NavLink
                              to={{
                                pathname: `/press-release/${item.title.replace(
                                  / /g,
                                  '-',
                                )}`,
                                state: { pressid: item.id },
                              }}
                            >
                              {' '}
                              {item.title}
                            </NavLink>
                          </div>
                        )
                      })
                    ) : (
                      <div>There is no Press Release</div>
                    )}
                  </div>
                )}
                <div className="atbdb_content_module_contents"></div>
              </div>
            </div>
            <div className="col-md-4 mt-5 mt-md-0">
              <div className="sidebar">
                <Category
                  list={categoryList}
                  onViewAll={() => history.push('/press-all')}
                  filterCategory={(id) => setSelCategoryid(id)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
